import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getBalance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const balance = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return balance?.balance ?? 10000; // Default starting balance
  },
});

export const getPosition = query({
  args: { marketId: v.id("markets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("positions")
      .withIndex("by_user_and_market", (q) =>
        q.eq("userId", userId).eq("marketId", args.marketId)
      )
      .first();
  },
});

export const getUserPositions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const positions = await ctx.db
      .query("positions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const positionsWithMarkets = await Promise.all(
      positions.map(async (position) => {
        const market = await ctx.db.get(position.marketId);
        return { ...position, market };
      })
    );

    return positionsWithMarkets.filter(p => p.market && (p.yesShares > 0 || p.noShares > 0));
  },
});

export const getUserTrades = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const trades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    const tradesWithMarkets = await Promise.all(
      trades.map(async (trade) => {
        const market = await ctx.db.get(trade.marketId);
        return { ...trade, market };
      })
    );

    return tradesWithMarkets;
  },
});

export const executeTrade = mutation({
  args: {
    marketId: v.id("markets"),
    side: v.union(v.literal("yes"), v.literal("no")),
    action: v.union(v.literal("buy"), v.literal("sell")),
    shares: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const market = await ctx.db.get(args.marketId);
    if (!market) throw new Error("Market not found");
    if (market.resolved) throw new Error("Market already resolved");

    const price = args.side === "yes" ? market.yesPrice : market.noPrice;
    const total = (args.shares * price) / 100;

    // Get or create balance
    let balanceDoc = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const currentBalance = balanceDoc?.balance ?? 10000;

    // Get or create position
    let position = await ctx.db
      .query("positions")
      .withIndex("by_user_and_market", (q) =>
        q.eq("userId", userId).eq("marketId", args.marketId)
      )
      .first();

    if (args.action === "buy") {
      if (currentBalance < total) throw new Error("Insufficient balance");

      // Update balance
      if (balanceDoc) {
        await ctx.db.patch(balanceDoc._id, { balance: currentBalance - total });
      } else {
        await ctx.db.insert("balances", { userId, balance: 10000 - total });
      }

      // Update position
      if (position) {
        if (args.side === "yes") {
          const newShares = position.yesShares + args.shares;
          const newAvgCost = ((position.avgYesCost * position.yesShares) + (price * args.shares)) / newShares;
          await ctx.db.patch(position._id, { yesShares: newShares, avgYesCost: newAvgCost });
        } else {
          const newShares = position.noShares + args.shares;
          const newAvgCost = ((position.avgNoCost * position.noShares) + (price * args.shares)) / newShares;
          await ctx.db.patch(position._id, { noShares: newShares, avgNoCost: newAvgCost });
        }
      } else {
        await ctx.db.insert("positions", {
          userId,
          marketId: args.marketId,
          yesShares: args.side === "yes" ? args.shares : 0,
          noShares: args.side === "no" ? args.shares : 0,
          avgYesCost: args.side === "yes" ? price : 0,
          avgNoCost: args.side === "no" ? price : 0,
        });
      }
    } else {
      // Sell
      if (!position) throw new Error("No position to sell");
      const currentShares = args.side === "yes" ? position.yesShares : position.noShares;
      if (currentShares < args.shares) throw new Error("Insufficient shares");

      // Update balance
      if (balanceDoc) {
        await ctx.db.patch(balanceDoc._id, { balance: currentBalance + total });
      } else {
        await ctx.db.insert("balances", { userId, balance: 10000 + total });
      }

      // Update position
      if (args.side === "yes") {
        await ctx.db.patch(position._id, { yesShares: position.yesShares - args.shares });
      } else {
        await ctx.db.patch(position._id, { noShares: position.noShares - args.shares });
      }
    }

    // Record trade
    await ctx.db.insert("trades", {
      userId,
      marketId: args.marketId,
      side: args.side,
      action: args.action,
      shares: args.shares,
      price,
      total,
      createdAt: Date.now(),
    });

    // Update market volume and slightly adjust price based on trade
    const priceImpact = (args.shares / 1000) * (args.action === "buy" ? 1 : -1);
    let newYesPrice = market.yesPrice;
    let newNoPrice = market.noPrice;

    if (args.side === "yes") {
      newYesPrice = Math.max(1, Math.min(99, market.yesPrice + priceImpact));
      newNoPrice = 100 - newYesPrice;
    } else {
      newNoPrice = Math.max(1, Math.min(99, market.noPrice + priceImpact));
      newYesPrice = 100 - newNoPrice;
    }

    await ctx.db.patch(args.marketId, {
      yesPrice: Math.round(newYesPrice * 100) / 100,
      noPrice: Math.round(newNoPrice * 100) / 100,
      totalVolume: market.totalVolume + total,
    });

    return { success: true };
  },
});
