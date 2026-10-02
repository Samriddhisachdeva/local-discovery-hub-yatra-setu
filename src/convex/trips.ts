import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { categoryValidator } from "./schema";
import type { Doc } from "./_generated/dataModel";
import { MutationCtx, mutation, query } from "./_generated/server";

type Ctx = MutationCtx;

async function getOwnTrip(ctx: Ctx, itineraryId: string) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Sign in first.");
  const id = await ctx.db.normalizeId("itineraries", itineraryId);
  if (id === null) throw new Error("Trip not found.");
  const trip = await ctx.db.get(id);
  if (!trip || trip.userId !== userId) throw new Error("Trip not found.");
  return { userId, id, trip };
}

/** All trips the signed-in traveller owns, most recently updated first. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("itineraries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    destination: v.string(),
    budget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in first.");
    const title = args.title.trim() || `${args.destination.trim()} trip`;
    const destination = args.destination.trim();
    if (!destination) throw new Error("Where are you heading?");
    return await ctx.db.insert("itineraries", {
      userId,
      title,
      destination,
      budget: args.budget,
      items: [],
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    itineraryId: v.id("itineraries"),
    title: v.optional(v.string()),
    destination: v.optional(v.string()),
    budget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, trip } = await getOwnTrip(ctx, args.itineraryId);
    await ctx.db.patch(id, {
      title: args.title?.trim() || trip.title,
      destination: args.destination?.trim() || trip.destination,
      budget: args.budget ?? trip.budget,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { itineraryId: v.id("itineraries") },
  handler: async (ctx, args) => {
    const { id } = await getOwnTrip(ctx, args.itineraryId);
    await ctx.db.delete(id);
  },
});

/** Add a place to a given day of a trip (denormalised for display). */
export const addItem = mutation({
  args: {
    itineraryId: v.id("itineraries"),
    placeId: v.id("places"),
    day: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, trip } = await getOwnTrip(ctx, args.itineraryId);
    const place = await ctx.db.get(args.placeId);
    if (!place) throw new Error("Place not found.");
    if (trip.items.some((i) => i.placeId === args.placeId)) {
      throw new Error("Already in this trip.");
    }
    const day = Math.max(1, Math.min(14, Math.round(args.day)));
    const item = {
      placeId: args.placeId,
      title: place.title,
      destination: place.destination,
      category: place.category,
      cost: place.cost,
      image: place.image,
      day,
    };
    const items = [...trip.items];
    // keep the array ordered by day, then insertion order
    const lastIndex = items.map((i) => i.day).lastIndexOf(day);
    if (lastIndex === -1) {
      items.push(item);
      items.sort((a, b) => a.day - b.day);
    } else {
      items.splice(lastIndex + 1, 0, item);
    }
    await ctx.db.patch(id, { items, updatedAt: Date.now() });
  },
});

export const removeItem = mutation({
  args: { itineraryId: v.id("itineraries"), placeId: v.id("places") },
  handler: async (ctx, args) => {
    const { id, trip } = await getOwnTrip(ctx, args.itineraryId);
    await ctx.db.patch(id, {
      items: trip.items.filter((i) => i.placeId !== args.placeId),
      updatedAt: Date.now(),
    });
  },
});

const moveAction = v.union(
  v.literal("up"),
  v.literal("down"),
  v.literal("earlierDay"),
  v.literal("laterDay"),
);

/** Reorder an item within its day, or shift it to the previous/next day. */
export const moveItem = mutation({
  args: {
    itineraryId: v.id("itineraries"),
    placeId: v.id("places"),
    action: moveAction,
  },
  handler: async (ctx, args) => {
    const { id, trip } = await getOwnTrip(ctx, args.itineraryId);
    const items = [...trip.items];
    const index = items.findIndex((i) => i.placeId === args.placeId);
    if (index === -1) return;
    const item = items[index];
    const dayPeers = items
      .map((i, idx) => ({ i, idx }))
      .filter((x) => x.i.day === item.day);

    if (args.action === "up" || args.action === "down") {
      const position = dayPeers.findIndex((x) => x.idx === index);
      const target = dayPeers[position + (args.action === "up" ? -1 : 1)];
      if (!target) return;
      items[index] = target.i;
      items[target.idx] = item;
    } else {
      const delta = args.action === "earlierDay" ? -1 : 1;
      const newDay = item.day + delta;
      if (newDay < 1 || newDay > 14) return;
      items.splice(index, 1);
      item.day = newDay;
      items.push(item);
      items.sort((a, b) => a.day - b.day);
    }
    await ctx.db.patch(id, { items, updatedAt: Date.now() });
  },
});

/** Approximate spend (₹/person) when a place has no explicit cost. */
const COST_FALLBACK: Record<string, number> = {
  free: 0,
  budget: 250,
  moderate: 700,
  splurge: 1500,
};

/**
 * Auto-generate a day-wise itinerary from a destination's places, shaped by
 * trip duration, total budget and pace. Ranks local places by rating, hidden-
 * gem status, the traveller's interests and cost, then fills each day within
 * the budget while keeping categories varied.
 */
export const autoPlan = mutation({
  args: {
    itineraryId: v.optional(v.id("itineraries")),
    destination: v.string(),
    title: v.optional(v.string()),
    days: v.number(),
    budget: v.number(),
    pace: v.union(
      v.literal("relaxed"),
      v.literal("standard"),
      v.literal("packed"),
    ),
    interests: v.array(categoryValidator),
    replace: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in first.");

    const destination = args.destination.trim();
    if (!destination) throw new Error("Where are you heading?");
    const days = Math.max(1, Math.min(10, Math.round(args.days)));
    const budget = Math.max(0, Math.round(args.budget));
    const perDay = args.pace === "relaxed" ? 2 : args.pace === "packed" ? 4 : 3;

    const all = await ctx.db.query("places").collect();
    const local = all.filter(
      (p) => p.destination.trim().toLowerCase() === destination.toLowerCase(),
    );
    if (local.length === 0) {
      const known = [...new Set(all.map((p) => p.destination))].join(", ");
      throw new Error(
        `No local places in “${destination}” yet. Try: ${known || "a seeded destination"}.`,
      );
    }

    const costOf = (p: Doc<"places">) => p.cost ?? COST_FALLBACK[p.budget] ?? 0;
    const ratingOf = (p: Doc<"places">) =>
      p.ratingCount > 0 ? p.ratingSum / p.ratingCount : 3.4;
    const interests = new Set<string>(args.interests);

    // Rank: interest match and hidden gems first, mild preference for value.
    const ranked = [...local]
      .map((p) => ({
        p,
        score:
          ratingOf(p) +
          (p.hiddenGem ? 0.4 : 0) +
          (interests.size === 0 || interests.has(p.category) ? 1.3 : 0) -
          costOf(p) / 6000,
      }))
      .sort((a, b) => b.score - a.score);

    // Fill up to days × pace stops without exceeding the budget.
    const capacity = days * perDay;
    const chosen: Doc<"places">[] = [];
    let spend = 0;
    for (const { p } of ranked) {
      if (chosen.length >= capacity) break;
      const cost = costOf(p);
      if (spend + cost > budget) continue;
      chosen.push(p);
      spend += cost;
    }
    if (chosen.length === 0) {
      const cheapest = Math.min(...local.map(costOf));
      throw new Error(
        `That budget covers nothing in ${destination} — keep at least ₹${cheapest} per person.`,
      );
    }

    // Spread the picks across days, keeping categories varied inside a day.
    const stopsPerDay = Math.max(1, Math.ceil(chosen.length / days));
    const pool = [...chosen];
    const items: Doc<"itineraries">["items"] = [];
    for (let day = 1; day <= days && pool.length > 0; day++) {
      const used: string[] = [];
      for (let s = 0; s < stopsPerDay && pool.length > 0; s++) {
        let idx = pool.findIndex((p) => !used.includes(p.category));
        if (idx === -1) idx = 0;
        const place = pool.splice(idx, 1)[0];
        used.push(place.category);
        items.push({
          placeId: place._id,
          title: place.title,
          destination: place.destination,
          category: place.category,
          cost: costOf(place),
          image: place.image,
          day,
        });
      }
    }

    const spendTotal = items.reduce((sum, i) => sum + (i.cost ?? 0), 0);

    if (args.itineraryId) {
      const { id, trip } = await getOwnTrip(ctx, args.itineraryId);
      const merged = args.replace
        ? items
        : [
            ...trip.items,
            ...items.filter(
              (n) => !trip.items.some((i) => i.placeId === n.placeId),
            ),
          ];
      await ctx.db.patch(id, {
        title: args.title?.trim() || trip.title,
        destination,
        budget,
        items: merged,
        updatedAt: Date.now(),
      });
      return { itineraryId: id, stops: items.length, spend: spendTotal };
    }

    const itineraryId = await ctx.db.insert("itineraries", {
      userId,
      title:
        args.title?.trim() ||
        `${destination} in ${days} day${days > 1 ? "s" : ""}`,
      destination,
      budget,
      items,
      updatedAt: Date.now(),
    });
    return { itineraryId, stops: items.length, spend: spendTotal };
  },
});
