import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("markets")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("resolved"), false))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("markets")
      .withIndex("by_resolved", (q) => q.eq("resolved", false))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("markets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getRecentTrades = query({
  args: { marketId: v.id("markets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trades")
      .withIndex("by_market", (q) => q.eq("marketId", args.marketId))
      .order("desc")
      .take(20);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingMarkets = await ctx.db.query("markets").take(1);
    if (existingMarkets.length > 0) return;

    const markets = [
      {
        title: "Will Bitcoin reach $150k by end of 2025?",
        description: "This market resolves YES if Bitcoin's price reaches or exceeds $150,000 USD on any major exchange before January 1, 2026.",
        category: "Crypto",
        yesPrice: 42,
        noPrice: 58,
        totalVolume: 2847500,
      },
      {
        title: "Will AI pass the Turing Test by 2026?",
        description: "Market resolves YES if an AI system convincingly passes a standardized Turing Test judged by experts before 2026.",
        category: "Technology",
        yesPrice: 67,
        noPrice: 33,
        totalVolume: 1523000,
      },
      {
        title: "SpaceX Starship orbital flight success in Q1 2025?",
        description: "Resolves YES if SpaceX achieves a successful Starship orbital flight completing all mission objectives in Q1 2025.",
        category: "Science",
        yesPrice: 78,
        noPrice: 22,
        totalVolume: 892000,
      },
      {
        title: "Will Taylor Swift announce new album in 2025?",
        description: "This market resolves YES if Taylor Swift officially announces a new studio album release for 2025.",
        category: "Entertainment",
        yesPrice: 85,
        noPrice: 15,
        totalVolume: 456000,
      },
      {
        title: "Fed interest rate cut by March 2025?",
        description: "Resolves YES if the Federal Reserve cuts interest rates by at least 25 basis points before April 1, 2025.",
        category: "Finance",
        yesPrice: 51,
        noPrice: 49,
        totalVolume: 5230000,
      },
      {
        title: "Ethereum ETF approval before June 2025?",
        description: "Market resolves YES if SEC approves a spot Ethereum ETF before June 30, 2025.",
        category: "Crypto",
        yesPrice: 72,
        noPrice: 28,
        totalVolume: 3890000,
      },
      {
        title: "Will GPT-5 be released in 2025?",
        description: "Resolves YES if OpenAI publicly releases GPT-5 or equivalent next-generation model in 2025.",
        category: "Technology",
        yesPrice: 63,
        noPrice: 37,
        totalVolume: 1890000,
      },
      {
        title: "Will there be a major earthquake (7.0+) in California in 2025?",
        description: "Market resolves YES if a magnitude 7.0 or greater earthquake occurs in California during 2025.",
        category: "Science",
        yesPrice: 23,
        noPrice: 77,
        totalVolume: 234000,
      },
    ];

    for (const market of markets) {
      await ctx.db.insert("markets", {
        ...market,
        endDate: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days from now
        resolved: false,
        createdAt: Date.now(),
      });
    }
  },
});
