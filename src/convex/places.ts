import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { budgetValidator, categoryValidator } from "./schema";
import { mutation, query } from "./_generated/server";

/**
 * All places, plus anything the signed-in local has contributed.
 * The dataset is small in v1, so the client does the search/filtering and
 * stays reactive as new contributions arrive.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("places").order("desc").collect();
  },
});

/** Places the signed-in user contributed (their "My contributions" list). */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("places")
      .withIndex("by_contributor", (q) => q.eq("contributorId", userId))
      .order("desc")
      .collect();
  },
});

/** A local contributes a new place or experience. Published immediately, attribution kept. */
export const create = mutation({
  args: {
    title: v.string(),
    destination: v.string(),
    category: categoryValidator,
    summary: v.string(),
    description: v.string(),
    tips: v.array(v.string()),
    budget: budgetValidator,
    bestTime: v.optional(v.string()),
    hiddenGem: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to contribute a place.");
    const user = await ctx.db.get(userId);
    const title = args.title.trim();
    const destination = args.destination.trim();
    if (title.length < 3) throw new Error("Give the place a proper name.");
    if (destination.length < 2) throw new Error("Which destination is this in?");
    if (args.summary.trim().length < 10)
      throw new Error("Add a one-line summary (at least 10 characters).");

    return await ctx.db.insert("places", {
      title,
      destination,
      category: args.category,
      summary: args.summary.trim(),
      description: args.description.trim(),
      tips: args.tips.map((t) => t.trim()).filter(Boolean),
      budget: args.budget,
      bestTime: args.bestTime?.trim() || undefined,
      hiddenGem: args.hiddenGem,
      contributorId: userId,
      contributorName: user?.name || user?.email || "A local",
      ratingSum: 0,
      ratingCount: 0,
      createdAt: Date.now(),
    });
  },
});
