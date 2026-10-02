import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * A traveller asks a specific guide for help on a trip. The guide can then
 * accept or deny the request from their portal.
 */
export const create = mutation({
  args: {
    guideId: v.id("guides"),
    date: v.string(), // YYYY-MM-DD or "flexible"
    days: v.number(),
    partySize: v.number(),
    message: v.string(),
    contact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to send a request.");

    const guide = await ctx.db.get(args.guideId);
    if (!guide) throw new Error("Guide not found.");
    if (guide.status !== "active")
      throw new Error("This guide is not accepting requests yet.");

    const message = args.message.trim();
    if (message.length < 15)
      throw new Error("Tell the guide a bit more (15+ characters).");

    const user = await ctx.db.get(userId);
    const travelerName = user?.name ?? user?.email ?? "Traveller";

    // Block duplicate open requests to the same guide.
    const existing = await ctx.db
      .query("guideRequests")
      .withIndex("by_traveler", (q) => q.eq("travelerId", userId))
      .order("desc")
      .take(50);
    const duplicate = existing.find(
      (r) => r.guideId === args.guideId && r.status === "pending",
    );
    if (duplicate)
      throw new Error("You already have a pending request with this guide.");

    return await ctx.db.insert("guideRequests", {
      guideId: args.guideId,
      travelerId: userId,
      travelerName,
      guideName: guide.name,
      destination: guide.destination,
      date: args.date.trim() || "flexible",
      days: Math.min(30, Math.max(1, Math.round(args.days))),
      partySize: Math.min(20, Math.max(1, Math.round(args.partySize))),
      message,
      contact: args.contact?.trim() || undefined,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/** Requests the signed-in traveller has sent (newest first). */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("guideRequests")
      .withIndex("by_traveler", (q) => q.eq("travelerId", userId))
      .order("desc")
      .collect();
  },
});

/** Requests addressed to the signed-in local's guide profile (portal inbox). */
export const forGuide = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const profiles = await ctx.db
      .query("guides")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    if (profiles[0] === undefined) return [];
    return await ctx.db
      .query("guideRequests")
      .withIndex("by_guide", (q) =>
        q.eq("guideId", profiles[0]._id).eq("status", "pending"),
      )
      .order("desc")
      .collect();
  },
});

/** Already-handled requests for the portal history. */
export const forGuideResolved = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const profiles = await ctx.db
      .query("guides")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    if (profiles[0] === undefined) return [];
    const all = await ctx.db
      .query("guideRequests")
      .withIndex("by_guide", (q) => q.eq("guideId", profiles[0]._id))
      .order("desc")
      .collect();
    return all.filter((r) => r.status !== "pending");
  },
});

/** The guide accepts or denies a pending request. */
export const respond = mutation({
  args: {
    requestId: v.id("guideRequests"),
    decision: v.union(v.literal("accepted"), v.literal("denied")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in first.");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found.");
    if (request.status !== "pending")
      throw new Error("This request has already been handled.");

    const profile = await ctx.db
      .query("guides")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!profile || profile._id !== request.guideId)
      throw new Error("This request is not addressed to you.");

    await ctx.db.patch(args.requestId, {
      status: args.decision,
      responseNote: args.note?.trim() || undefined,
      respondedAt: Date.now(),
    });
  },
});

/** The traveller cancels their own pending request. */
export const cancel = mutation({
  args: { requestId: v.id("guideRequests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in first.");
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found.");
    if (request.travelerId !== userId)
      throw new Error("This is not your request.");
    if (request.status !== "pending")
      throw new Error("Only pending requests can be cancelled.");
    await ctx.db.patch(args.requestId, { status: "cancelled" });
  },
});
