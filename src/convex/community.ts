import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { MutationCtx, mutation, query } from "./_generated/server";

const targetTypeValidator = v.union(v.literal("place"), v.literal("guide"));

async function bumpRating(
  ctx: MutationCtx,
  targetType: "place" | "guide",
  targetId: string,
  oldRating: number | null,
  newRating: number,
) {
  const table = targetType === "place" ? "places" : "guides";
  const id = await ctx.db.normalizeId(table, targetId);
  if (id === null) return;
  const doc = await ctx.db.get(id);
  if (!doc) return;
  const sum = doc.ratingSum - (oldRating ?? 0) + newRating;
  const count = doc.ratingCount - (oldRating === null ? 0 : 1) + 1;
  await ctx.db.patch(id, { ratingSum: sum, ratingCount: count });
}

/** Reviews for a place or guide, newest first. */
export const forTarget = query({
  args: {
    targetType: targetTypeValidator,
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_target", (q) =>
        q.eq("targetType", args.targetType).eq("targetId", args.targetId),
      )
      .order("desc")
      .collect();
    return reviews;
  },
});

/** Leave a rating + comment; one review per user per target (updated in place). */
export const add = mutation({
  args: {
    targetType: targetTypeValidator,
    targetId: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to leave a review.");
    const user = await ctx.db.get(userId);
    const rating = Math.max(1, Math.min(5, Math.round(args.rating)));
    const comment = args.comment.trim();
    if (comment.length < 5)
      throw new Error("Add a few words about your experience.");

    const existing = (
      await ctx.db
        .query("reviews")
        .withIndex("by_target", (q) =>
          q.eq("targetType", args.targetType).eq("targetId", args.targetId),
        )
        .collect()
    ).find((r) => r.authorId === userId);

    const authorName = user?.name || user?.email || "Traveller";
    if (existing) {
      await ctx.db.patch(existing._id, { rating, comment, authorName });
      await bumpRating(
        ctx,
        args.targetType,
        args.targetId,
        existing.rating,
        rating,
      );
      return existing._id;
    }
    const id = await ctx.db.insert("reviews", {
      authorId: userId,
      authorName,
      targetType: args.targetType,
      targetId: args.targetId,
      rating,
      comment,
      createdAt: Date.now(),
    });
    await bumpRating(ctx, args.targetType, args.targetId, null, rating);
    return id;
  },
});

/** Report fake, unsafe, or suspicious content. Routed to moderation. */
export const report = mutation({
  args: {
    targetType: targetTypeValidator,
    targetId: v.string(),
    reason: v.union(
      v.literal("fake"),
      v.literal("inappropriate"),
      v.literal("suspicious"),
      v.literal("location"),
      v.literal("safety"),
    ),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("reports", {
      reporterId: userId ?? undefined,
      targetType: args.targetType,
      targetId: args.targetId,
      reason: args.reason,
      details: args.details?.trim() || undefined,
      status: "open",
      createdAt: Date.now(),
    });
  },
});
