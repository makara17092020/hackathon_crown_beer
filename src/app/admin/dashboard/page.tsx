"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BEERS } from "@/utils/beers";

type Vote = {
  beerId: string;
  beerName?: string;
  brewery?: string;
  rating: number;
  submittedAt: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "beers" | "settings">(
    "overview",
  );
  const [beerFilter, setBeerFilter] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/admin/check");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
      } catch (e) {
        router.push("/admin/login");
        return;
      }
      const stash = JSON.parse(localStorage.getItem("ccb_votes") || "[]");
      setVotes(stash);
    }
    init();
  }, [router]);

  const stats = useMemo(() => {
    const map: Record<
      string,
      {
        beerId: string;
        name: string;
        brewery?: string;
        count: number;
        avgRating: number;
        ratings: number[];
      }
    > = {};

    votes.forEach((v) => {
      if (!map[v.beerId]) {
        const beer = BEERS.find((b) => b.id === v.beerId);
        map[v.beerId] = {
          beerId: v.beerId,
          name: beer?.name || v.beerName || "Unknown",
          brewery: beer?.brewery || v.brewery,
          count: 0,
          avgRating: 0,
          ratings: [],
        };
      }
      map[v.beerId].count += 1;
      map[v.beerId].ratings.push(v.rating);
    });

    return Object.values(map).map((m) => ({
      ...m,
      avgRating: m.ratings.length
        ? +(m.ratings.reduce((a, b) => a + b, 0) / m.ratings.length).toFixed(2)
        : 0,
    }));
  }, [votes]);

  const totalVotes = votes.length;
  const avgRatingOverall = useMemo(() => {
    if (votes.length === 0) return 0;
    const sum = votes.reduce((s, v) => s + Number(v.rating || 0), 0);
    return +(sum / votes.length).toFixed(2);
  }, [votes]);

  const top5 = useMemo(() => {
    return stats
      .slice()
      .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating)
      .slice(0, 5);
  }, [stats]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    router.push("/admin/login");
  }

  function handleRefresh() {
    const stash = JSON.parse(localStorage.getItem("ccb_votes") || "[]");
    setVotes(stash);
  }

  // Toast for transient messages
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleClearVotes() {
    try {
      localStorage.removeItem("ccb_votes");
      setVotes([]);
      showToast("Cleared votes successfully", "success");
    } catch (e) {
      showToast("Could not clear votes", "error");
    }
  }

  function handleExportCSV() {
    const headers = ["beerId", "beerName", "brewery", "rating", "submittedAt"];
    const rows = votes.map((v) => [
      v.beerId,
      v.beerName || "",
      v.brewery || "",
      String(v.rating),
      v.submittedAt,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ccb_votes_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Small inline SVG horizontal bar chart for top 5
  const BarChart: React.FC<{ data: typeof top5 }> = ({ data }) => {
    if (!data || data.length === 0)
      return <div className="text-gray-500">No data</div>;
    const max = Math.max(...data.map((d) => d.count));
    return (
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.beerId} className="flex items-center gap-3">
            <div className="w-36 text-sm font-medium text-gray-700">
              {d.name}
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-4 bg-gradient-to-r from-emerald-500 to-green-500"
                  style={{ width: `${(d.count / (max || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-right text-sm font-semibold">
              {d.count}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[70vh] container mx-auto py-8 px-4">
      <div className="flex gap-6 h-full">
        {/* Sidebar */}
        <aside className="w-64 h-full bg-emerald-700 text-white rounded-lg p-4 shadow-md flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Admin</h2>
            <div className="text-sm text-emerald-100/80">Dashboard</div>
          </div>

          <nav className="space-y-2 mb-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "overview"
                  ? "bg-emerald-600/90 font-semibold"
                  : "hover:bg-emerald-600/80"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("beers")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "beers"
                  ? "bg-emerald-600/90 font-semibold"
                  : "hover:bg-emerald-600/80"
              }`}
            >
              Beers
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "settings"
                  ? "bg-emerald-600/90 font-semibold"
                  : "hover:bg-emerald-600/80"
              }`}
            >
              Settings
            </button>
          </nav>

          <div className="mt-auto space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500"
            >
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 relative">
          {/* Toast */}
          {toast && (
            <div
              role="status"
              aria-live="polite"
              className={`fixed right-6 top-6 z-50 px-4 py-2 rounded shadow-lg text-sm font-medium ${
                toast.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {toast.message}
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="text-sm text-gray-600">
                Votes & results overview
              </div>
            </div>
          </div>

          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-lg shadow border">
                  <div className="text-sm text-gray-500">Total votes</div>
                  <div className="mt-2 text-2xl font-bold text-emerald-700">
                    {totalVotes}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border">
                  <div className="text-sm text-gray-500">Distinct beers</div>
                  <div className="mt-2 text-2xl font-bold">{stats.length}</div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border">
                  <div className="text-sm text-gray-500">Average rating</div>
                  <div className="mt-2 text-2xl font-bold text-amber-600">
                    {avgRatingOverall || "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-4 rounded-lg shadow border">
                  <h2 className="font-semibold mb-3">Top Beers</h2>
                  {top5.length === 0 ? (
                    <div className="text-gray-600">No votes recorded yet.</div>
                  ) : (
                    <BarChart data={top5} />
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow border">
                  <h2 className="font-semibold mb-3">Top Results (table)</h2>
                  {stats.length === 0 ? (
                    <div className="text-gray-600 text-sm">
                      No votes recorded yet.
                    </div>
                  ) : (
                    <div className="overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-gray-500">
                            <th className="pb-2">Beer</th>
                            <th className="pb-2">Votes</th>
                            <th className="pb-2">Avg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats
                            .slice()
                            .sort(
                              (a, b) =>
                                b.count - a.count || b.avgRating - a.avgRating,
                            )
                            .map((s) => (
                              <tr key={s.beerId} className="border-t">
                                <td className="py-2 font-medium">{s.name}</td>
                                <td className="py-2">{s.count}</td>
                                <td className="py-2">{s.avgRating}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "beers" && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">All Beers</h2>
                <div className="flex items-center gap-2">
                  <input
                    value={beerFilter}
                    onChange={(e) => setBeerFilter(e.target.value)}
                    placeholder="Search beers or breweries..."
                    className="px-3 py-2 border rounded-md w-64"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BEERS.filter((b) => {
                  if (!beerFilter) return true;
                  const q = beerFilter.toLowerCase();
                  return (
                    b.name.toLowerCase().includes(q) ||
                    b.brewery.toLowerCase().includes(q) ||
                    b.style.toLowerCase().includes(q)
                  );
                }).map((beer) => {
                  const s = stats.find((st) => st.beerId === beer.id);
                  const max = Math.max(...stats.map((x) => x.count), 1);
                  const pct = Math.round(((s?.count || 0) / max) * 100);
                  const initials = beer.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("");
                  return (
                    <div
                      key={beer.id}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold">{beer.name}</div>
                            <div className="text-xs text-gray-500">
                              {beer.brewery}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {s?.avgRating || "—"} / 10
                          </div>
                          <div className="text-xs text-gray-500">
                            {s?.count || 0} votes
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="h-2 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-2 bg-gradient-to-r from-emerald-500 to-green-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {pct}% of top votes
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Settings</h2>
              <div className="space-y-6 text-gray-700">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-lg mb-2">
                    Admin Username
                  </div>
                  <div className="text-sm text-gray-600">
                    (Configured in server .env file)
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-lg mb-2">
                    Votes Storage
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Votes are currently stored in browser localStorage under the
                    key{" "}
                    <code className="bg-gray-200 px-1 py-0.5 rounded">
                      ccb_votes
                    </code>{" "}
                    for demonstration purposes.
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleClearVotes}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                    >
                      Clear All Votes
                    </button>
                    <button
                      onClick={handleRefresh}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200"
                    >
                      Refresh View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
