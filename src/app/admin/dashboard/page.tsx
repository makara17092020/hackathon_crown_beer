"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Trophy,
  LogOut,
  RefreshCcw,
  Trash2,
  MapPin,
  Loader2,
  Building2,
  Edit2,
  X,
  TrendingUp,
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

  // Colors sampled from logo
  const brand = {
    teal: "#00B5B5",
    orange: "#F08E1E",
    navy: "#1A3C5A",
    lightNavy: "#2A4C6A",
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
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
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A3C5A]/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center animate-popIn">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h3 className={`text-2xl font-black text-[${brand.navy}] mb-2`}>
              Are you sure?
            </h3>
            <p className="text-gray-500 mb-8 font-medium">
              This brewery and its record will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl transition shadow-lg shadow-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Using Navy from Elephant */}
      <aside className="w-72 bg-[#1A3C5A] text-white p-6 flex flex-col shadow-2xl sticky h-screen top-0">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Trophy className="text-[#F08E1E]" size={28} /> BEER CROWN
          </h2>
          <p className="text-[10px] text-[#00B5B5] font-bold uppercase tracking-widest mt-1">
            Admin Control Center
          </p>
        </div>
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${activeTab === "overview" ? "bg-[#00B5B5] shadow-lg" : "text-gray-300 hover:bg-[#2A4C6A]"}`}
          >
            <TrendingUp size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${activeTab === "leaderboard" ? "bg-[#00B5B5] shadow-lg" : "text-gray-300 hover:bg-[#2A4C6A]"}`}
          >
            <Award size={20} /> Leaderboard
          </button>
          <button
            onClick={() => setActiveTab("breweries")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${activeTab === "breweries" ? "bg-[#00B5B5] shadow-lg" : "text-gray-300 hover:bg-[#2A4C6A]"}`}
          >
            <Building2 size={20} /> Breweries
          </button>
        </nav>
        <div className="pt-6 border-t border-[#2A4C6A]">
          <button
            onClick={() => fetchData()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2A4C6A] text-white rounded-xl text-sm font-bold mb-3 hover:bg-[#00B5B5] transition"
          >
            <RefreshCcw size={16} /> Sync Data
          </button>
          <button
            onClick={() =>
              fetch("/api/admin/logout", { method: "POST" }).then(() =>
                router.push("/admin/login"),
              )
            }
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#1A3C5A] rounded-xl text-sm font-black transition active:scale-95"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {toast && (
          <div
            className={`fixed top-10 right-10 p-4 rounded-2xl text-white shadow-2xl z-50 animate-bounce ${toast.type === "success" ? "bg-[#00B5B5]" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}

        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-[#00B5B5]">
            <Loader2 className="animate-spin h-16 w-16 mb-4" />
            <p className="font-black text-xl tracking-tight">
              Updating Insights...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="animate-fadeIn">
                <header className="mb-10 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-[#1A3C5A]">
                      Event Overview
                    </h1>
                    <p className="text-gray-500 font-medium">
                      Real-time statistics & podium
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[#00B5B5] uppercase tracking-widest">
                      Active Now
                    </p>
                    <p className="text-2xl font-black text-[#1A3C5A] tracking-tighter">
                      Live Updates
                    </p>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-[#00B5B5] transition hover:shadow-xl hover:-translate-y-1">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      Total Votes
                    </p>
                    <p className="text-6xl font-black text-[#1A3C5A] mt-2">
                      {stats.totalVotes}
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-[#F08E1E] transition hover:shadow-xl hover:-translate-y-1">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      Global Avg
                    </p>
                    <p className="text-6xl font-black text-[#1A3C5A] mt-2">
                      {stats.avgRating}
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border-b-8 border-[#1A3C5A] transition hover:shadow-xl hover:-translate-y-1">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      Breweries
                    </p>
                    <p className="text-6xl font-black text-[#1A3C5A] mt-2">
                      {breweries.length}
                    </p>
                  </div>
                </div>

                {/* PODIUM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mt-12">
                  {stats.breweryStats.slice(0, 3).map((b, idx) => {
                    const rankConfig = [
                      {
                        gradient: "from-[#F08E1E] to-[#D67910]",
                        icon: "👑",
                        label: "Champion",
                      }, // Orange Primary
                      {
                        gradient: "from-[#00B5B5] to-[#008F8F]",
                        icon: "🥈",
                        label: "Runner Up",
                      }, // Teal Primary
                      {
                        gradient: "from-[#1A3C5A] to-[#0D253A]",
                        icon: "🥉",
                        label: "Third Place",
                      }, // Navy
                    ][idx];

                    return (
                      <div
                        key={b._id}
                        className={`group relative rounded-[3rem] p-1 transition-all duration-500 hover:-translate-y-3 ${idx === 0 ? "order-2 md:scale-110 z-20" : idx === 1 ? "order-1" : "order-3"}`}
                      >
                        <div
                          className={`relative h-full w-full rounded-[2.9rem] overflow-hidden bg-gradient-to-br ${rankConfig.gradient} p-8`}
                        >
                          <div className="flex justify-between items-start mb-8 text-white">
                            <span className="text-5xl font-black italic">
                              0{idx + 1}
                            </span>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                              {rankConfig.icon}
                            </div>
                          </div>
                          <div className="flex flex-col items-center text-center mb-8">
                            <div className="relative w-24 h-24 rounded-3xl bg-white p-3 shadow-2xl mb-4">
                              <Image
                                src={b.logoUrl}
                                alt="logo"
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <h4 className="text-2xl font-black text-white leading-tight min-h-[3.5rem] flex items-center">
                              {b.name}
                            </h4>
                            <div className="mt-2 bg-black/10 px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase">
                              {rankConfig.label}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 p-4 bg-white/10 rounded-[2rem] border border-white/20 text-white">
                            <div className="text-center border-r border-white/10">
                              <p className="text-[9px] font-black uppercase">
                                Score
                              </p>
                              <p className="text-2xl font-black">{b.average}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[9px] font-black uppercase">
                                Votes
                              </p>
                              <p className="text-2xl font-black">
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

            {activeTab === "leaderboard" && (
              <div className="animate-fadeIn">
                <header className="mb-10">
                  <h1 className="text-4xl font-black text-[#1A3C5A]">
                    Full Rankings
                  </h1>
                </header>
                <div className="space-y-4">
                  {stats.breweryStats.map((b, index) => (
                    <div
                      key={b._id}
                      className="bg-white p-6 rounded-3xl border flex items-center gap-6 hover:shadow-md transition"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${index === 0 ? "bg-[#FFF4E5] text-[#F08E1E]" : "bg-gray-100 text-gray-400"}`}
                      >
                        {index + 1}
                      </div>
                      <div className="relative w-16 h-16 border rounded-xl bg-gray-50">
                        <Image
                          src={b.logoUrl}
                          alt="logo"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-[#1A3C5A]">
                          {b.name}
                        </h4>
                        <p className="text-sm text-gray-400 font-bold">
                          {b.voteCount} Votes
                        </p>
                      </div>
                      <div className="text-right px-6 border-l">
                        <p className="text-xs font-black text-gray-400 uppercase">
                          Score
                        </p>
                        <p className="text-3xl font-black text-[#00B5B5]">
                          {b.average}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "breweries" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fadeIn">
                <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border sticky top-10">
                    <h3 className="text-2xl font-black text-[#1A3C5A] mb-6">
                      {editingId ? "Edit" : "New"} Brewery
                    </h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Brewery Name"
                        required
                        className="w-full p-4 bg-gray-50 focus:border-[#00B5B5] border-2 rounded-2xl outline-none font-bold"
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
                        className="w-full p-4 bg-gray-50 focus:border-[#00B5B5] border-2 rounded-2xl outline-none font-bold"
                        value={breweryForm.location}
                        onChange={(e) =>
                          setBreweryForm({
                            ...breweryForm,
                            location: e.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Description"
                        required
                        className="w-full p-4 bg-gray-50 focus:border-[#00B5B5] border-2 rounded-2xl h-32 outline-none font-medium"
                        value={breweryForm.description}
                        onChange={(e) =>
                          setBreweryForm({
                            ...breweryForm,
                            description: e.target.value,
                          })
                        }
                      />
                      <button
                        disabled={uploading}
                        className={`w-full py-5 text-white rounded-2xl font-black text-lg transition shadow-xl ${editingId ? "bg-[#F08E1E]" : "bg-[#00B5B5]"}`}
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
                      className={`bg-white p-8 rounded-[2.5rem] border shadow-sm relative ${editingId === brewery._id ? "border-[#F08E1E] ring-4 ring-[#FFF4E5]" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-16 h-16 rounded-2xl bg-gray-50 border">
                              <Image
                                src={brewery.logoUrl}
                                alt={brewery.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-[#1A3C5A]">
                                {brewery.name}
                              </h4>
                              <p className="text-[#00B5B5] text-xs font-black uppercase">
                                Maps Linked
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-500 font-medium bg-gray-50 p-6 rounded-2xl border">
                            {brewery.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => startEdit(brewery)}
                            className="p-4 bg-[#FFF4E5] text-[#F08E1E] rounded-2xl transition"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => setDeleteId(brewery._id)}
                            className="p-4 bg-red-50 text-red-500 rounded-2xl transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-popIn {
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
