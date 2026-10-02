import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

/** Place categories used across discovery, filters, and cover art. */
export const CATEGORIES = [
  "history",
  "nature",
  "market",
  "food",
  "culture",
  "spiritual",
  "adventure",
  "hidden",
] as const;
export const categoryValidator = v.union(
  v.literal("history"),
  v.literal("nature"),
  v.literal("market"),
  v.literal("food"),
  v.literal("culture"),
  v.literal("spiritual"),
  v.literal("adventure"),
  v.literal("hidden"),
);
export type Category = Infer<typeof categoryValidator>;

export const BUDGETS = ["free", "budget", "moderate", "splurge"] as const;
export const budgetValidator = v.union(
  v.literal("free"),
  v.literal("budget"),
  v.literal("moderate"),
  v.literal("splurge"),
);
export type Budget = Infer<typeof budgetValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // A place or experience contributed by a local resident.
    places: defineTable({
      title: v.string(),
      destination: v.string(),
      category: categoryValidator,
      summary: v.string(),
      description: v.string(),
      tips: v.array(v.string()),
      budget: budgetValidator,
      bestTime: v.optional(v.string()),
      hiddenGem: v.boolean(),
      image: v.optional(v.string()),
      cost: v.optional(v.number()),
      contributorId: v.optional(v.id("users")),
      contributorName: v.optional(v.string()),
      ratingSum: v.number(),
      ratingCount: v.number(),
      createdAt: v.number(),
    })
      .index("by_destination", ["destination"])
      .index("by_contributor", ["contributorId"]),

    // A local guide profile (traveller-facing when status is "active").
    guides: defineTable({
      userId: v.optional(v.id("users")),
      name: v.string(),
      destination: v.string(),
      headline: v.string(),
      bio: v.string(),
      languages: v.array(v.string()),
      expertise: v.array(v.string()),
      years: v.number(),
      contact: v.string(),
      verified: v.boolean(),
      status: v.union(v.literal("active"), v.literal("pending")),
      ratingSum: v.number(),
      ratingCount: v.number(),
      createdAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_user", ["userId"]),

    // One day-wise itinerary per trip, owned by a traveller.
    itineraries: defineTable({
      userId: v.id("users"),
      title: v.string(),
      destination: v.string(),
      budget: v.optional(v.number()),
      items: v.array(
        v.object({
          placeId: v.id("places"),
          title: v.string(),
          destination: v.string(),
          category: categoryValidator,
          cost: v.optional(v.number()),
          image: v.optional(v.string()),
          day: v.number(),
        }),
      ),
      updatedAt: v.number(),
    }).index("by_user", ["userId"]),

    // Reviews for places and guides.
    reviews: defineTable({
      authorId: v.optional(v.id("users")),
      authorName: v.string(),
      targetType: v.union(v.literal("place"), v.literal("guide")),
      targetId: v.string(),
      rating: v.number(),
      comment: v.string(),
      createdAt: v.number(),
    }).index("by_target", ["targetType", "targetId"]),

    // Safety reports raised by travellers against places or guides.
    reports: defineTable({
      reporterId: v.optional(v.id("users")),
      targetType: v.union(v.literal("place"), v.literal("guide")),
      targetId: v.string(),
      reason: v.union(
        v.literal("fake"),
        v.literal("inappropriate"),
        v.literal("suspicious"),
        v.literal("location"),
        v.literal("safety"),
      ),
      details: v.optional(v.string()),
      status: v.union(
        v.literal("open"),
        v.literal("reviewing"),
        v.literal("resolved"),
      ),
      createdAt: v.number(),
    }).index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
