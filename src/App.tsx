import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  Clock,
  DollarSign,
  ChevronRight,
  X,
  LogOut,
  User,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  Home,
  Briefcase,
  History,
} from "lucide-react";

type Market = {
  _id: Id<"markets">;
  title: string;
  description: string;
  category: string;
  endDate: number;
  resolved: boolean;
  outcome?: "yes" | "no";
  yesPrice: number;
  noPrice: number;
  totalVolume: number;
  imageUrl?: string;
  createdAt: number;
};

type Position = {
  _id: Id<"positions">;
  userId: Id<"users">;
  marketId: Id<"markets">;
  yesShares: number;
  noShares: number;
  avgYesCost: number;
  avgNoCost: number;
  market?: Market | null;
};

type Trade = {
  _id: Id<"trades">;
  userId: Id<"users">;
  marketId: Id<"markets">;
  side: "yes" | "no";
  action: "buy" | "sell";
  shares: number;
  price: number;
  total: number;
  createdAt: number;
  market?: Market | null;
};

function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-rose-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-[#12131a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4"
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
              PredictFlow
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Trade on real-world events</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm sm:text-base"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Please wait..." : flow === "signIn" ? "Sign In" : "Create Account"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {flow === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("anonymous")}
              className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Zap className="w-4 h-4" />
              Continue as Guest
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MarketCard({ market, onClick }: { market: Market; onClick: () => void }) {
  const isPositive = market.yesPrice > 50;

  return (
    <motion.div
      layoutId={`market-${market._id}`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="bg-[#12131a]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-white/10 transition-all group"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <span className="px-2 sm:px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-gray-400">
          {market.category}
        </span>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock className="w-3 h-3" />
          {Math.ceil((market.endDate - Date.now()) / (1000 * 60 * 60 * 24))}d left
        </div>
      </div>

      <h3 className="text-white font-semibold mb-3 sm:mb-4 line-clamp-2 group-hover:text-emerald-400 transition-colors text-sm sm:text-base leading-tight">
        {market.title}
      </h3>

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex-1 bg-white/5 rounded-lg p-2 sm:p-3">
          <div className="text-xs text-gray-500 mb-1">Yes</div>
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold text-lg sm:text-xl">{market.yesPrice}¢</span>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-2 sm:p-3">
          <div className="text-xs text-gray-500 mb-1">No</div>
          <div className="flex items-center gap-1">
            <span className="text-rose-400 font-bold text-lg sm:text-xl">{market.noPrice}¢</span>
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>${(market.totalVolume / 1000).toFixed(0)}K volume</span>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
      </div>
    </motion.div>
  );
}

function TradeModal({ market, onClose }: { market: Market; onClose: () => void }) {
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [shares, setShares] = useState(10);
  const [loading, setLoading] = useState(false);

  const balance = useQuery(api.trading.getBalance);
  const position = useQuery(api.trading.getPosition, { marketId: market._id });
  const executeTrade = useMutation(api.trading.executeTrade);

  const price = side === "yes" ? market.yesPrice : market.noPrice;
  const total = (shares * price) / 100;
  const currentShares = position ? (side === "yes" ? position.yesShares : position.noShares) : 0;

  const handleTrade = async () => {
    setLoading(true);
    try {
      await executeTrade({ marketId: market._id, side, action, shares });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canTrade = action === "buy"
    ? (balance ?? 0) >= total
    : currentShares >= shares;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-[#12131a] border-t sm:border border-white/10 sm:rounded-2xl overflow-hidden rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <span className="px-2 py-1 bg-white/5 rounded-lg text-xs font-medium text-gray-400">
                {market.category}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-2 leading-tight">{market.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => setSide("yes")}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                side === "yes"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${side === "yes" ? "text-emerald-400" : "text-gray-400"}`} />
                <span className={`font-semibold text-sm sm:text-base ${side === "yes" ? "text-emerald-400" : "text-gray-400"}`}>
                  Yes
                </span>
              </div>
              <div className={`text-xl sm:text-2xl font-bold ${side === "yes" ? "text-emerald-400" : "text-gray-500"}`}>
                {market.yesPrice}¢
              </div>
            </button>
            <button
              onClick={() => setSide("no")}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                side === "no"
                  ? "border-rose-500 bg-rose-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                <TrendingDown className={`w-4 h-4 sm:w-5 sm:h-5 ${side === "no" ? "text-rose-400" : "text-gray-400"}`} />
                <span className={`font-semibold text-sm sm:text-base ${side === "no" ? "text-rose-400" : "text-gray-400"}`}>
                  No
                </span>
              </div>
              <div className={`text-xl sm:text-2xl font-bold ${side === "no" ? "text-rose-400" : "text-gray-500"}`}>
                {market.noPrice}¢
              </div>
            </button>
          </div>

          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setAction("buy")}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                action === "buy"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setAction("sell")}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                action === "sell"
                  ? "bg-rose-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sell
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Shares</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max={action === "sell" ? Math.max(1, currentShares) : 100}
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="flex-1 accent-emerald-500"
              />
              <input
                type="number"
                min="1"
                max={action === "sell" ? currentShares : 100}
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="w-16 sm:w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Price per share</span>
              <span className="text-white">{price}¢</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Shares</span>
              <span className="text-white">{shares}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm sm:text-base">Total</span>
              <span className="text-white font-bold text-base sm:text-lg">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 px-1">
            <span>Balance: ${(balance ?? 0).toFixed(2)}</span>
            <span>Position: {currentShares} shares</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTrade}
            disabled={loading || !canTrade}
            className={`w-full py-3 sm:py-4 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm sm:text-base ${
              action === "buy"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-rose-500 to-rose-600 text-white"
            }`}
          >
            {loading ? "Processing..." : `${action === "buy" ? "Buy" : "Sell"} ${shares} ${side.toUpperCase()} shares`}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PortfolioView() {
  const positions = useQuery(api.trading.getUserPositions);
  const balance = useQuery(api.trading.getBalance);

  const totalValue = (positions ?? []).reduce((acc: number, pos: Position) => {
    if (!pos.market) return acc;
    const yesValue = pos.yesShares * (pos.market.yesPrice / 100);
    const noValue = pos.noShares * (pos.market.noPrice / 100);
    return acc + yesValue + noValue;
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Cash Balance</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            ${(balance ?? 0).toFixed(2)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Portfolio Value</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            ${totalValue.toFixed(2)}
          </div>
        </motion.div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Your Positions</h3>
        {!positions || positions.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-6 sm:p-8 text-center">
            <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm sm:text-base">No positions yet</p>
            <p className="text-gray-500 text-xs sm:text-sm">Start trading to build your portfolio</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {positions.map((position: Position) => (
              <motion.div
                key={position._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#12131a]/80 border border-white/5 rounded-xl p-3 sm:p-4"
              >
                <h4 className="text-white font-medium mb-2 text-sm sm:text-base line-clamp-1">
                  {position.market?.title}
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                  {position.yesShares > 0 && (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      {position.yesShares} YES @ {position.avgYesCost.toFixed(0)}¢
                    </div>
                  )}
                  {position.noShares > 0 && (
                    <div className="flex items-center gap-1 text-rose-400">
                      <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      {position.noShares} NO @ {position.avgNoCost.toFixed(0)}¢
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TradeHistoryView() {
  const trades = useQuery(api.trading.getUserTrades);

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Trade History</h3>
      {!trades || trades.length === 0 ? (
        <div className="bg-white/5 rounded-2xl p-6 sm:p-8 text-center">
          <History className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm sm:text-base">No trades yet</p>
          <p className="text-gray-500 text-xs sm:text-sm">Your trading activity will appear here</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {trades.map((trade: Trade) => (
            <motion.div
              key={trade._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#12131a]/80 border border-white/5 rounded-xl p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm sm:text-base line-clamp-1 mb-1">
                    {trade.market?.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      trade.action === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                    }`}>
                      {trade.action.toUpperCase()}
                    </span>
                    <span className={`text-xs ${trade.side === "yes" ? "text-emerald-400" : "text-rose-400"}`}>
                      {trade.shares} {trade.side.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs">@ {trade.price}¢</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-white font-semibold text-sm sm:text-base">${trade.total.toFixed(2)}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(trade.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [view, setView] = useState<"markets" | "portfolio" | "history">("markets");
  const [category, setCategory] = useState<string | null>(null);

  const markets = useQuery(api.markets.list, { category: category ?? undefined });
  const seedMarkets = useMutation(api.markets.seed);

  useEffect(() => {
    seedMarkets();
  }, [seedMarkets]);

  const categories = ["All", "Crypto", "Technology", "Science", "Finance", "Entertainment"];

  return (
    <div className="min-h-screen bg-[#0a0b0d] pb-20 sm:pb-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0b0d]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">PredictFlow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-2">
              {[
                { id: "markets", label: "Markets", icon: TrendingUp },
                { id: "portfolio", label: "Portfolio", icon: Briefcase },
                { id: "history", label: "History", icon: History },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as typeof view)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    view === item.id
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => signOut()}
              className="p-2 sm:px-4 sm:py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {view === "markets" ? (
            <motion.div
              key="markets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero Section */}
              <div className="mb-6 sm:mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2"
                >
                  Prediction Markets
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-400 text-sm sm:text-base"
                >
                  Trade on the outcome of real-world events
                </motion.p>
              </div>

              {/* Category Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === "All" ? null : cat)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      (cat === "All" && !category) || category === cat
                        ? "bg-emerald-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

              {/* Markets Grid */}
              {!markets ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white/5 rounded-2xl h-48 animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                  {markets.map((market: Market, i: number) => (
                    <motion.div
                      key={market._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <MarketCard market={market} onClick={() => setSelectedMarket(market)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : view === "portfolio" ? (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Portfolio</h1>
              <PortfolioView />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Trade History</h1>
              <TradeHistoryView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0b0d]/95 backdrop-blur-xl border-t border-white/10 sm:hidden z-40">
        <div className="flex items-center justify-around py-2">
          {[
            { id: "markets", label: "Markets", icon: TrendingUp },
            { id: "portfolio", label: "Portfolio", icon: Briefcase },
            { id: "history", label: "History", icon: History },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as typeof view)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                view === item.id ? "text-emerald-400" : "text-gray-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-8">
        <div className="text-center text-xs text-gray-600">
          Requested by @web-user · Built by @clonkbot
        </div>
      </footer>

      {/* Trade Modal */}
      <AnimatePresence>
        {selectedMarket && (
          <TradeModal market={selectedMarket} onClose={() => setSelectedMarket(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return <Dashboard />;
}
