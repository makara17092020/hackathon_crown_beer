"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Trophy,
  Star,
  LogOut,
  RefreshCcw,
  Plus,
  Trash2,
  MapPin,
  Loader2,
  Building2,
  Edit2,
  X,
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
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

type Brewery = {
  _id: string;
  name: string;
  description: string;
  location: string;
  logoUrl: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "breweries" | "leaderboard"
  >("overview");

  // Modern Delete Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form & Edit States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [breweryForm, setBreweryForm] = useState({
    name: "",
    description: "",
    location: "",
    image: null as File | null,
  });

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // --- CALCULATIONS ---
  const stats = useMemo(() => {
    const totalVotes = votes.length;
    const avgRating =
      totalVotes > 0
        ? (votes.reduce((acc, v) => acc + v.rating, 0) / totalVotes).toFixed(1)
        : "0";

    const breweryStats = breweries
      .map((b) => {
        const bVotes = votes.filter(
          (v) => v.productId === b._id || v.brewery === b.name,
        );
        const totalBRating = bVotes.reduce((acc, v) => acc + v.rating, 0);
        const bAvg =
          bVotes.length > 0 ? (totalBRating / bVotes.length).toFixed(1) : "0.0";
        return { ...b, average: parseFloat(bAvg), voteCount: bVotes.length };
      })
      .sort((a, b) => b.average - a.average || b.voteCount - a.voteCount);

    return { totalVotes, avgRating, breweryStats };
  }, [votes, breweries]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [votesRes, breweriesRes] = await Promise.all([
        fetch("/api/admin/votes"),
        fetch("/api/admin/breweries"),
      ]);
      if (votesRes.ok) setVotes(await votesRes.json());
      if (breweriesRes.ok) setBreweries(await breweriesRes.json());
    } catch (e) {
      showToast("Failed to sync data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/admin/check");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      await fetchData();
    }
    init();
  }, [router]);

  // --- ACTIONS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBreweryForm({ ...breweryForm, image: file });
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const startEdit = (brewery: Brewery) => {
    setEditingId(brewery._id);
    setBreweryForm({
      name: brewery.name,
      description: brewery.description,
      location: brewery.location,
      image: null,
    });
    setPreviewUrl(brewery.logoUrl);
    setActiveTab("breweries");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPreviewUrl(null);
    setBreweryForm({ name: "", description: "", location: "", image: null });
  };

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId && !breweryForm.image)
      return showToast("Please select a logo", "error");
    setUploading(true);
    const formData = new FormData();
    formData.append("name", breweryForm.name);
    formData.append("description", breweryForm.description);
    formData.append("location", breweryForm.location);
    if (breweryForm.image) formData.append("image", breweryForm.image);

    try {
      const url = editingId
        ? `/api/admin/breweries/${editingId}`
        : "/api/admin/breweries";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        body:
          editingId && !breweryForm.image
            ? JSON.stringify({
                name: breweryForm.name,
                description: breweryForm.description,
                location: breweryForm.location,
              })
            : formData,
        ...(editingId &&
          !breweryForm.image && {
            headers: { "Content-Type": "application/json" },
          }),
      });
      if (res.ok) {
        showToast(editingId ? "Brewery updated!" : "Brewery added!");
        cancelEdit();
        fetchData();
      }
    } catch (e) {
      showToast("Operation failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/breweries/${deleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Brewery deleted");
      setDeleteId(null);
      fetchData();
    }
  }

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Modern Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-red-50 text-center animate-popIn">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-500 mb-8 font-medium">
              This brewery and its record will be permanently removed from the
              festival.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition shadow-lg shadow-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-emerald-950 text-white p-6 flex flex-col shadow-2xl sticky h-screen top-0">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Trophy className="text-amber-400" size={28} /> BEER CROWN
          </h2>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">
            Admin Control Center
          </p>
        </div>
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${activeTab === "overview" ? "bg-emerald-600 shadow-lg" : "text-emerald-300 hover:bg-emerald-900"}`}
          >
            <TrendingUp size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${activeTab === "leaderboard" ? "bg-emerald-600 shadow-lg" : "text-emerald-300 hover:bg-emerald-900"}`}
          >
            <Award size={20} /> Leaderboard
          </button>
          <button
            onClick={() => setActiveTab("breweries")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${activeTab === "breweries" ? "bg-emerald-600 shadow-lg" : "text-emerald-300 hover:bg-emerald-900"}`}
          >
            <Building2 size={20} /> Breweries
          </button>
        </nav>
        <div className="pt-6 border-t border-emerald-900">
          <button
            onClick={() => fetchData()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-900 text-white rounded-xl text-sm font-bold mb-3 hover:bg-emerald-800 transition"
          >
            <RefreshCcw size={16} /> Sync Data
          </button>
          <button
            onClick={() =>
              fetch("/api/admin/logout", { method: "POST" }).then(() =>
                router.push("/admin/login"),
              )
            }
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-emerald-950 rounded-xl text-sm font-black transition active:scale-95"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {toast && (
          <div
            className={`fixed top-10 right-10 p-4 rounded-2xl text-white shadow-2xl z-50 animate-bounce ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}

        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-emerald-600">
            <Loader2 className="animate-spin h-16 w-16 mb-4" />
            <p className="font-black text-xl tracking-tight">
              Updating Insights...
            </p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="animate-fadeIn">
                <header className="mb-10 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-gray-900">
                      Event Overview
                    </h1>
                    <p className="text-gray-500 font-medium">
                      Real-time statistics & podium
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                      Active Now
                    </p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">
                      Live Updates
                    </p>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-emerald-500 transition hover:shadow-xl hover:-translate-y-1">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      Total Votes
                    </p>
                    <p className="text-6xl font-black text-gray-900 mt-2">
                      {stats.totalVotes}
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-amber-500 transition hover:shadow-xl hover:-translate-y-1">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      Global Avg
                    </p>
                    <p className="text-6xl font-black text-gray-900 mt-2">
                      {stats.avgRating}
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-blue-500 transition hover:shadow-xl hover:-translate-y-1">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      Breweries
                    </p>
                    <p className="text-6xl font-black text-gray-900 mt-2">
                      {breweries.length}
                    </p>
                  </div>
                </div>

                {/* TOP 3 PODIUM - Modern Gradient Design */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <Trophy className="text-amber-500" size={28} />
                      The Podium
                    </h3>
                    <p className="text-gray-500 font-bold text-sm">
                      Real-time festival leaders
                    </p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                    Live Rankings
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                  {stats.breweryStats.slice(0, 3).map((b, idx) => {
                    // Premium Configuration for the Top 3
                    const rankConfig = [
                      {
                        gradient: "from-[#FFD700] via-[#FDB931] to-[#D4AF37]", // Gold
                        glow: "shadow-[0_20px_50px_rgba(253,185,49,0.3)]",
                        icon: "👑",
                        label: "Festival Leader",
                      },
                      {
                        gradient: "from-[#E2E8F0] via-[#94A3B8] to-[#64748B]", // Silver
                        glow: "shadow-[0_20px_50px_rgba(148,163,184,0.2)]",
                        icon: "🥈",
                        label: "Runner Up",
                      },
                      {
                        gradient: "from-[#E9967A] via-[#CD7F32] to-[#A0522D]", // Bronze
                        glow: "shadow-[0_20px_50px_rgba(205,127,50,0.2)]",
                        icon: "🥉",
                        label: "Third Place",
                      },
                    ][idx];

                    return (
                      <div
                        key={b._id}
                        className={`group relative rounded-[3rem] p-1 transition-all duration-500 hover:-translate-y-3 ${rankConfig.glow} ${idx === 0 ? "order-2 md:scale-110 z-20" : idx === 1 ? "order-1" : "order-3"}`}
                      >
                        {/* The Main Card Body */}
                        <div
                          className={`relative h-full w-full rounded-[2.9rem] overflow-hidden bg-gradient-to-br ${rankConfig.gradient} p-8`}
                        >
                          {/* Decorative Background Element */}
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all" />

                          {/* Header: Rank & Icon */}
                          <div className="flex justify-between items-start mb-8">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                                Rank
                              </span>
                              <span className="text-5xl font-black text-white italic drop-shadow-md">
                                0{idx + 1}
                              </span>
                            </div>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                              {rankConfig.icon}
                            </div>
                          </div>

                          {/* Brewery Identity */}
                          <div className="flex flex-col items-center text-center mb-8">
                            <div className="relative w-24 h-24 rounded-3xl bg-white p-3 shadow-2xl mb-4 group-hover:rotate-3 transition-transform duration-500">
                              <Image
                                src={b.logoUrl}
                                alt="logo"
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <h4 className="text-2xl font-black text-white leading-tight drop-shadow-sm min-h-[3.5rem] flex items-center">
                              {b.name}
                            </h4>
                            <div className="mt-2 bg-black/10 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                              {rankConfig.label}
                            </div>
                          </div>

                          {/* Stats Section: Glassmorphism style */}
                          <div className="grid grid-cols-2 gap-4 p-4 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20">
                            <div className="text-center border-r border-white/10">
                              <p className="text-[9px] font-black uppercase text-white/70 tracking-tighter">
                                Avg Score
                              </p>
                              <p className="text-2xl font-black text-white">
                                {b.average}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-[9px] font-black uppercase text-white/70 tracking-tighter">
                                Total Votes
                              </p>
                              <p className="text-2xl font-black text-white">
                                {b.voteCount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === "leaderboard" && (
              <div className="animate-fadeIn">
                <header className="mb-10">
                  <h1 className="text-4xl font-black text-gray-900">
                    Full Rankings
                  </h1>
                  <p className="text-gray-500 font-medium">
                    Detailed performance of all participants
                  </p>
                </header>
                <div className="space-y-4">
                  {stats.breweryStats.map((b, index) => (
                    <div
                      key={b._id}
                      className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-6 hover:shadow-md transition cursor-default group"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${index === 0 ? "bg-amber-100 text-amber-600 ring-2 ring-amber-400" : "bg-gray-100 text-gray-400"}`}
                      >
                        {index + 1}
                      </div>
                      <div className="relative w-16 h-16 flex-shrink-0 border rounded-xl bg-gray-50 group-hover:scale-105 transition">
                        <Image
                          src={b.logoUrl}
                          alt="logo"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-black text-gray-900 truncate">
                          {b.name}
                        </h4>
                        <p className="text-sm text-gray-500 font-bold">
                          {b.voteCount} Total Votes
                        </p>
                      </div>
                      <div className="text-right px-6 border-l">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          Score
                        </p>
                        <p className="text-3xl font-black text-emerald-600">
                          {b.average}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANAGE BREWERIES TAB */}
            {activeTab === "breweries" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fadeIn">
                <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border sticky top-10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-900">
                        {editingId ? "Edit" : "New"} Brewery
                      </h3>
                      {editingId && (
                        <button
                          onClick={cancelEdit}
                          className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    <div className="mb-6 relative w-full h-44 bg-gray-50 rounded-2xl border-4 border-dashed border-gray-100 flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="text-center text-gray-300">
                          <Building2 className="mx-auto mb-2" size={40} />
                          <p className="text-[10px] font-black uppercase">
                            Upload Logo
                          </p>
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Brewery Name"
                        required
                        className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 border-2 rounded-2xl outline-none transition-all font-bold"
                        value={breweryForm.name}
                        onChange={(e) =>
                          setBreweryForm({
                            ...breweryForm,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Google Maps URL"
                        required
                        className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 border-2 rounded-2xl outline-none transition-all font-bold"
                        value={breweryForm.location}
                        onChange={(e) =>
                          setBreweryForm({
                            ...breweryForm,
                            location: e.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Tell us about this brewery..."
                        required
                        className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 border-2 rounded-2xl h-32 outline-none transition-all font-medium"
                        value={breweryForm.description}
                        onChange={(e) =>
                          setBreweryForm({
                            ...breweryForm,
                            description: e.target.value,
                          })
                        }
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm font-bold text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700"
                      />
                      <button
                        disabled={uploading}
                        className={`w-full py-5 text-white rounded-2xl font-black text-lg transition shadow-xl active:scale-95 ${editingId ? "bg-amber-500 shadow-amber-100" : "bg-emerald-600 shadow-emerald-100"}`}
                      >
                        {uploading
                          ? "Processing..."
                          : editingId
                            ? "Update Brewery"
                            : "Register Brewery"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {breweries.map((brewery) => (
                    <div
                      key={brewery._id}
                      className={`bg-white p-8 rounded-[2.5rem] border shadow-sm transition-all relative ${editingId === brewery._id ? "border-amber-400 ring-4 ring-amber-50" : "hover:shadow-md"}`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-16 h-16 rounded-2xl bg-gray-50 border p-1 overflow-hidden">
                              <Image
                                src={brewery.logoUrl}
                                alt={brewery.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-gray-900 leading-none">
                                {brewery.name}
                              </h4>
                              <p className="text-emerald-600 text-xs font-black uppercase tracking-tighter mt-1 flex items-center gap-1">
                                <MapPin size={10} /> Maps Linked
                              </p>
                            </div>
                          </div>
                          {/* DESCRIPTION DISPLAY */}
                          <p className="text-gray-500 font-medium leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            {brewery.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => startEdit(brewery)}
                            className="p-4 bg-amber-50 text-amber-500 hover:bg-amber-100 rounded-2xl transition"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => setDeleteId(brewery._id)}
                            className="p-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {breweries.length === 0 && (
                    <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center text-gray-400 font-bold">
                      No breweries registered yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-popIn {
          animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
