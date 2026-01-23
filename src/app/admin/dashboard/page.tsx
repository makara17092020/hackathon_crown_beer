"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BEERS } from "@/utils/beers";
import {
  Trophy,
  Star,
  Beer,
  Settings,
  LogOut,
  RefreshCcw,
  Download,
} from "lucide-react";

type Vote = {
  _id: string;
  userEmail: string;
  productId: string;
  beerName: string;
  brewery: string;
  rating: number;
  votedAt: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "beers" | "settings">(
    "overview",
  );
  const [beerFilter, setBeerFilter] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/votes");
      if (res.ok) {
        const data = await res.json();
        setVotes(data);
      }
    } catch (e) {
      showToast("Failed to load votes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/admin/check");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        await fetchVotes();
      } catch (e) {
        router.push("/admin/login");
      }
    }
    init();
  }, [router]);

  // Calculate statistics for beers that HAVE votes
  const stats = useMemo(() => {
    const map: Record<
      string,
      {
        productId: string;
        name: string;
        brewery: string;
        count: number;
        ratings: number[];
      }
    > = {};
    votes.forEach((v) => {
      if (!map[v.productId]) {
        map[v.productId] = {
          productId: v.productId,
          name: v.beerName,
          brewery: v.brewery,
          count: 0,
          ratings: [],
        };
      }
      map[v.productId].count += 1;
      map[v.productId].ratings.push(v.rating);
    });
    return Object.values(map)
      .map((m) => ({
        ...m,
        avgRating: +(
          m.ratings.reduce((a, b) => a + b, 0) / m.ratings.length
        ).toFixed(2),
      }))
      .sort((a, b) => b.avgRating - a.avgRating || b.count - a.count); // Rank by rating first
  }, [votes]);

  const totalVotes = votes.length;
  const avgRatingOverall = useMemo(() => {
    if (votes.length === 0) return 0;
    return +(votes.reduce((s, v) => s + v.rating, 0) / votes.length).toFixed(2);
  }, [votes]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleClearVotes() {
    if (!confirm("Permanently delete all votes?")) return;
    const res = await fetch("/api/admin/votes", { method: "DELETE" });
    if (res.ok) {
      setVotes([]);
      showToast("Database cleared");
    }
  }

  function handleExportCSV() {
    const headers = ["User", "Beer", "Brewery", "Rating", "Date"];
    const csv = [
      headers.join(","),
      ...votes.map((v) =>
        [v.userEmail, v.beerName, v.brewery, v.rating, v.votedAt].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beer_votes_${new Date().toLocaleDateString()}.csv`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-emerald-900 text-white p-6 flex flex-col shadow-2xl">
        <div className="mb-10">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Trophy className="text-amber-400" /> CROWN ADMIN
          </h2>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">
            Festival 2026
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "overview" ? "bg-emerald-700 shadow-lg" : "hover:bg-emerald-800"}`}
          >
            <Star size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("beers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "beers" ? "bg-emerald-700 shadow-lg" : "hover:bg-emerald-800"}`}
          >
            <Beer size={18} /> All Beers
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "settings" ? "bg-emerald-700 shadow-lg" : "hover:bg-emerald-800"}`}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="pt-6 border-t border-emerald-800 space-y-3">
          <button
            onClick={fetchVotes}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-sm font-semibold transition"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-semibold transition"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-emerald-900 hover:bg-gray-100 rounded-lg text-sm font-bold transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {toast && (
          <div
            className={`fixed top-10 right-10 p-4 rounded-xl text-white shadow-2xl z-50 animate-bounce ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}

        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 capitalize">
            {activeTab} Dashboard
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Monitoring the Great Cambodian Craft Beer Festival
          </p>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-emerald-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="font-bold">Syncing with MongoDB...</p>
          </div>
        ) : activeTab === "overview" ? (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-emerald-500">
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Total Votes
                </p>
                <p className="text-5xl font-black text-gray-900 mt-2">
                  {totalVotes}
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-amber-500">
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Avg Rating
                </p>
                <p className="text-5xl font-black text-gray-900 mt-2">
                  {avgRatingOverall}
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-blue-500">
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Active Beers
                </p>
                <p className="text-5xl font-black text-gray-900 mt-2">
                  {stats.length}
                </p>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-black text-gray-800 uppercase tracking-tight">
                  🏆 High-Rated Leaderboard
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Sorted by Average Rating
                </span>
              </div>
              <div className="divide-y">
                {stats.length > 0 ? (
                  stats.map((s, index) => (
                    <div
                      key={s.productId}
                      className="p-6 flex items-center justify-between hover:bg-emerald-50/30 transition"
                    >
                      <div className="flex items-center gap-6">
                        <span
                          className={`text-2xl font-black w-8 ${index < 3 ? "text-amber-500" : "text-gray-300"}`}
                        >
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-extrabold text-gray-900 text-lg">
                            {s.name}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            {s.brewery}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-400 uppercase">
                            Votes
                          </p>
                          <p className="font-bold text-gray-900">{s.count}</p>
                        </div>
                        <div className="text-right bg-amber-50 px-6 py-2 rounded-2xl border border-amber-100">
                          <p className="text-xs font-bold text-amber-600 uppercase">
                            Rating
                          </p>
                          <p className="text-2xl font-black text-amber-700">
                            {s.avgRating}
                            <span className="text-sm text-amber-500">/10</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center text-gray-400 font-medium">
                    No votes recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "beers" ? (
          <div className="space-y-6">
            <div className="relative">
              <input
                className="w-full p-4 pl-12 bg-white border rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Search by beer name or brewery..."
                onChange={(e) => setBeerFilter(e.target.value)}
              />
              <Beer
                className="absolute left-4 top-4.5 text-gray-400"
                size={20}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {BEERS.filter(
                (b) =>
                  b.name.toLowerCase().includes(beerFilter.toLowerCase()) ||
                  b.brewery.toLowerCase().includes(beerFilter.toLowerCase()),
              ).map((beer) => {
                const s = stats.find((st) => st.productId === beer.id);
                return (
                  <div
                    key={beer.id}
                    className="bg-white p-6 rounded-2xl border flex items-center justify-between shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black">
                        {beer.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{beer.name}</h4>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">
                          {beer.brewery} • {beer.style}
                        </p>
                      </div>
                    </div>
                    <div className="text-right border-l pl-6">
                      <p className="text-2xl font-black text-gray-900">
                        {s?.count || 0}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Total Votes
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl bg-white p-10 rounded-3xl border shadow-sm">
            <h3 className="text-2xl font-black text-red-600 mb-4 flex items-center gap-2">
              <Settings /> System Maintenance
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Danger: Clearing the database will permanently delete all voter
              records and scores for the 2026 Festival. Please export a CSV
              backup first.
            </p>
            <button
              onClick={handleClearVotes}
              className="w-full py-4 bg-red-50 text-red-600 border-2 border-red-200 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all"
            >
              PURGE ALL DATABASE RECORDS
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
