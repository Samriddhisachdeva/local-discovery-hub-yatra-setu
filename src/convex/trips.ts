import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
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
  },
  handler: async (ctx, args) => {
    const { id, trip } = await getOwnTrip(ctx, args.itineraryId);
    await ctx.db.patch(id, {
      title: args.title?.trim() || trip.title,
      destination: args.destination?.trim() || trip.destination,
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
