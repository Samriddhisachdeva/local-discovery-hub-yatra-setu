import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Traveller-facing guide list: active guides, plus the signed-in user's own
 * profile so a local can preview a pending verification.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const guides = await ctx.db
      .query("guides")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .collect();
    if (userId === null) return guides;
    const own = await ctx.db
      .query("guides")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const ownIds = new Set(own.map((g) => g._id));
    return [...guides.filter((g) => !ownIds.has(g._id)), ...own];
  },
});

/** The signed-in local's own guide profile, if any. */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const guides = await ctx.db
      .query("guides")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return guides[0] ?? null;
  },
});

/** A local applies to become a verified guide (or updates their profile). */
export const apply = mutation({
  args: {
    name: v.string(),
    destination: v.string(),
    headline: v.string(),
    bio: v.string(),
    languages: v.array(v.string()),
    expertise: v.array(v.string()),
    years: v.number(),
    contact: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to apply.");
    const name = args.name.trim();
    const destination = args.destination.trim();
    const headline = args.headline.trim();
    const bio = args.bio.trim();
    const contact = args.contact.trim();
    if (name.length < 2) throw new Error("Enter your name.");
    if (!destination) throw new Error("Which destination do you guide in?");
    if (headline.length < 6) throw new Error("Add a short headline.");
    if (bio.length < 30)
      throw new Error("Tell travellers a bit more (30+ characters).");
    if (!contact) throw new Error("Travellers need a way to reach you.");

    const existing = await ctx.db
      .query("guides")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const patch = {
      userId,
      name,
      destination,
      headline,
      bio,
      languages: args.languages.filter(Boolean),
      expertise: args.expertise.filter(Boolean),
      years: Math.max(0, Math.round(args.years)),
      contact,
      // existing profiles keep their standing; new ones await verification
      status: (existing[0]?.status ?? "pending") as "active" | "pending",
      verified: existing[0]?.verified ?? false,
    };
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, patch);
      return existing[0]._id;
    }
    return await ctx.db.insert("guides", {
      ...patch,
      ratingSum: 0,
      ratingCount: 0,
      createdAt: Date.now(),
    });
  },
});

/**
 * Lightweight v1 verification: the guide confirms their details and becomes
 * visible to travellers with the verified badge.
 */
export const confirmIdentity = mutation({
  args: { guideId: v.id("guides") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in first.");
    const guide = await ctx.db.get(args.guideId);
    if (!guide || guide.userId !== userId)
      throw new Error("This is not your profile.");
    await ctx.db.patch(args.guideId, { status: "active", verified: true });
  },
});
