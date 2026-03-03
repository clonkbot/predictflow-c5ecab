import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Markets for prediction trading
  markets: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    endDate: v.number(),
    resolved: v.boolean(),
    outcome: v.optional(v.union(v.literal("yes"), v.literal("no"))),
    yesPrice: v.number(), // 0-100 representing probability
    noPrice: v.number(),
    totalVolume: v.number(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_resolved", ["resolved"])
    .index("by_end_date", ["endDate"]),

  // User positions in markets
  positions: defineTable({
    userId: v.id("users"),
    marketId: v.id("markets"),
    yesShares: v.number(),
    noShares: v.number(),
    avgYesCost: v.number(),
    avgNoCost: v.number(),
  }).index("by_user", ["userId"])
    .index("by_market", ["marketId"])
    .index("by_user_and_market", ["userId", "marketId"]),

  // Trade history
  trades: defineTable({
    userId: v.id("users"),
    marketId: v.id("markets"),
    side: v.union(v.literal("yes"), v.literal("no")),
    action: v.union(v.literal("buy"), v.literal("sell")),
    shares: v.number(),
    price: v.number(),
    total: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_market", ["marketId"])
    .index("by_created", ["createdAt"]),

  // User balances
  balances: defineTable({
    userId: v.id("users"),
    balance: v.number(),
  }).index("by_user", ["userId"]),
});
