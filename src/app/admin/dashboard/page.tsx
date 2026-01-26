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
  Edit2,
  TrendingUp,
  Award,
  RotateCcw,
  PlusCircle,
  Store,
  X,
  UploadCloud,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// --- TYPES ---
type Brewery = {
  _id: string;
  name: string;
  description: string;
  location: string;
  logoUrl: string;
};

type Vote = {
  _id: string;
  productId: string;
  brewery: string;
  rating: number;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

type BreweryForm = {
  name: string;
  description: string;
  location: string;
  image: File | null;
};

export default function AdminDashboard() {
  const router = useRouter();

  // --- STATE ---
  const [votes, setVotes] = useState<Vote[]>([]);
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [breweryForm, setBreweryForm] = useState<BreweryForm>({
    name: "",
    description: "",
    location: "",
    image: null,
  });

  const [resetModal, setResetModal] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // --- STATS CALCULATION ---
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
        const bAvg =
          bVotes.length > 0
            ? (
                bVotes.reduce((acc, v) => acc + v.rating, 0) / bVotes.length
              ).toFixed(1)
            : "0.0";
        return { ...b, average: parseFloat(bAvg), voteCount: bVotes.length };
      })
      .sort((a, b) => b.average - a.average || b.voteCount - a.voteCount);

    return { totalVotes, avgRating, breweryStats };
  }, [votes, breweries]);

  // --- API ACTIONS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, bRes] = await Promise.all([
        fetch("/api/admin/votes"),
        fetch("/api/admin/breweries"),
      ]);
      if (vRes.ok) setVotes(await vRes.json());
      if (bRes.ok) setBreweries(await bRes.json());
    } catch (e) {
      showToast("Sync failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const res = await fetch("/api/admin/check");
      if (!res.ok) router.push("/admin/login");
      else await fetchData();
    };
    init();
  }, [router]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBreweryForm({ ...breweryForm, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setBreweryForm({ ...breweryForm, image: null });
    setPreviewUrl(null);
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
    setActiveTab("register");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            ? JSON.stringify(breweryForm)
            : formData,
        ...(editingId &&
          !breweryForm.image && {
            headers: { "Content-Type": "application/json" },
          }),
      });

      if (res.ok) {
        showToast(editingId ? "Update Successful!" : "Added Successfully!");
        setEditingId(null);
        setBreweryForm({
          name: "",
          description: "",
          location: "",
          image: null,
        });
        setPreviewUrl(null);
        fetchData();
        setActiveTab("store");
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteBrewery = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/breweries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Brewery Removed", "success");
        fetchData();
      }
    } catch (e) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#1A3C5A]">
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#1A3C5A] text-white p-8 flex flex-col shadow-2xl sticky h-screen top-0">
        <div className="mb-12 px-2 flex items-center gap-3">
          <div className="p-2 bg-[#00B5B5] rounded-xl">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter">BEER CROWN</h2>
        </div>

        <nav className="space-y-3 flex-1">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "leaderboard", label: "Leaderboard", icon: Award },
            { id: "register", label: "Register Brewery", icon: PlusCircle },
            { id: "store", label: "Brewery Store", icon: Store },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all font-bold ${activeTab === item.id ? "bg-[#00B5B5] shadow-lg scale-[1.05]" : "text-white/40 hover:bg-white/5 hover:text-white"}`}
            >
              <item.icon size={22} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-3">
          <button
            onClick={() => setResetModal(true)}
            className="w-full flex items-center gap-3 px-6 py-4 bg-red-500/10 text-red-400 rounded-2xl text-sm font-black hover:bg-red-600 hover:text-white transition-all"
          >
            <RotateCcw size={18} /> RESET ALL
          </button>
          <button
            onClick={() => fetchData()}
            className="w-full flex items-center gap-3 px-6 py-4 bg-white/5 text-gray-400 rounded-2xl text-sm font-bold hover:text-white transition"
          >
            <RefreshCcw size={18} /> SYNC
          </button>
          <button
            onClick={() =>
              fetch("/api/admin/logout", { method: "POST" }).then(() =>
                router.push("/admin/login"),
              )
            }
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-[#1A3C5A] rounded-2xl text-sm font-black mt-4 transition active:scale-95"
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </aside>

      <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
        {toast && (
          <div
            className={`fixed top-10 right-10 px-8 py-4 rounded-2xl text-white shadow-2xl z-[150] font-black animate-bounce ${toast.type === "success" ? "bg-[#00B5B5]" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}

        {loading ? (
          <div className="h-[70vh] flex flex-col items-center justify-center text-[#00B5B5]">
            <Loader2 className="animate-spin h-16 w-16" />
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW (Refined Image Podium) */}
            {activeTab === "overview" && (
              <div className="animate-fadeIn">
                <h1 className="text-6xl font-black mb-12 tracking-tighter">
                  Festival Insights
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border-b-[15px] border-[#00B5B5]">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest mb-2">
                      Total Votes
                    </p>
                    <p className="text-8xl font-black tracking-tighter">
                      {stats.totalVotes}
                    </p>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border-b-[15px] border-[#F08E1E]">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest mb-2">
                      Event Rating
                    </p>
                    <p className="text-8xl font-black tracking-tighter">
                      {stats.avgRating}
                    </p>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border-b-[15px] border-[#1A3C5A]">
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest mb-2">
                      Breweries
                    </p>
                    <p className="text-8xl font-black tracking-tighter">
                      {breweries.length}
                    </p>
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-10 flex items-center gap-2 italic">
                  <Trophy className="text-[#F08E1E]" size={28} /> The Current
                  Podium
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-6xl">
                  {stats.breweryStats.slice(0, 3).map((b, idx) => {
                    const colors = [
                      { bg: "bg-[#F08E1E]", label: "CHAMPION", badge: "👑" },
                      { bg: "bg-[#00B5B5]", label: "RUNNER UP", badge: "🥈" },
                      { bg: "bg-[#1A3C5A]", label: "THIRD PLACE", badge: "🥉" },
                    ][idx];

                    return (
                      <div
                        key={b._id}
                        className={`${idx === 0 ? "order-2 md:scale-105 z-20" : idx === 1 ? "order-1" : "order-3"}`}
                      >
                        <div
                          className={`${colors.bg} rounded-[4rem] p-10 text-center shadow-2xl relative overflow-hidden transition-transform hover:-translate-y-2`}
                        >
                          <span className="absolute -right-4 -top-8 text-[12rem] font-black text-white/10 italic select-none leading-none">
                            {idx + 1}
                          </span>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                              <span className="text-6xl font-black text-white italic leading-none">
                                0{idx + 1}
                              </span>
                              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-2xl border border-white/30">
                                {colors.badge}
                              </div>
                            </div>

                            {/* Refined Image Container */}
                            <div className="mx-auto w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl mb-6 relative overflow-hidden border-4 border-white/20">
                              <Image
                                src={b.logoUrl}
                                alt="logo"
                                fill
                                className="object-cover"
                              />
                            </div>

                            <h4 className="text-3xl font-black text-white mb-6 min-h-[4rem] flex items-center justify-center leading-tight tracking-tighter">
                              {b.name}
                            </h4>

                            <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full inline-block text-[10px] font-black text-white tracking-[0.2em] mb-8 border border-white/20">
                              {colors.label}
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-black/20 backdrop-blur-lg p-6 rounded-[2.5rem] border border-white/10 text-white">
                              <div className="border-r border-white/10">
                                <p className="text-[10px] font-black opacity-60 mb-1">
                                  Score
                                </p>
                                <p className="text-3xl font-black">
                                  {b.average}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black opacity-60 mb-1">
                                  Votes
                                </p>
                                <p className="text-3xl font-black">
                                  {b.voteCount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. MODERN LEADERBOARD */}
            {activeTab === "leaderboard" && (
              <div className="animate-fadeIn">
                <header className="mb-12 flex justify-between items-end">
                  <div>
                    <h1 className="text-5xl font-black tracking-tighter">
                      Live Rankings
                    </h1>
                    <p className="text-gray-400 font-bold mt-2">
                      Sort by highest average rating
                    </p>
                  </div>
                </header>

                <div className="space-y-4">
                  {stats.breweryStats.map((b, i) => (
                    <div
                      key={b._id}
                      className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:border-[#00B5B5] transition-all duration-300"
                    >
                      <div className="flex items-center gap-8">
                        {/* Rank Badge */}
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${
                            i === 0
                              ? "bg-[#F08E1E] text-white"
                              : i === 1
                                ? "bg-[#00B5B5] text-white"
                                : i === 2
                                  ? "bg-[#1A3C5A] text-white"
                                  : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {i + 1}
                        </div>

                        {/* Brand Info */}
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 relative bg-gray-50 rounded-2xl overflow-hidden border p-1 shadow-inner group-hover:scale-110 transition-transform">
                            <Image
                              src={b.logoUrl}
                              alt="logo"
                              fill
                              className="object-cover rounded-xl"
                            />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">
                              {b.name}
                            </h4>
                            <p className="text-gray-400 text-sm font-bold">
                              {b.voteCount} community votes
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Section */}
                      <div className="flex items-center gap-12">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            Rating
                          </p>
                          <p className="text-4xl font-black text-[#00B5B5]">
                            {b.average}
                          </p>
                        </div>
                        <ChevronRight
                          className="text-gray-200 group-hover:text-[#00B5B5] group-hover:translate-x-1 transition-all"
                          size={32}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. REGISTER BREWERY */}
            {activeTab === "register" && (
              <div className="max-w-3xl mx-auto animate-fadeIn">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-t-[15px] border-[#00B5B5]">
                  <h3 className="text-5xl font-black mb-10 tracking-tighter">
                    {editingId ? "Update Brand" : "New Brand"}
                  </h3>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="relative">
                      {previewUrl ? (
                        <div className="relative w-full h-72 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex items-center justify-center overflow-hidden">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-4 right-4 p-4 bg-red-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition z-10"
                          >
                            <X size={28} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-72 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                          <UploadCloud
                            size={60}
                            className="text-gray-300 mb-2"
                          />
                          <p className="font-black text-gray-400">
                            UPLOAD LOGO
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>

                    <input
                      className="w-full p-7 bg-gray-50 rounded-[2rem] focus:border-[#00B5B5] border-4 border-transparent outline-none font-black text-2xl transition"
                      placeholder="Name"
                      value={breweryForm.name}
                      onChange={(e) =>
                        setBreweryForm({ ...breweryForm, name: e.target.value })
                      }
                      required
                    />
                    <input
                      className="w-full p-7 bg-gray-50 rounded-[2rem] focus:border-[#00B5B5] border-4 border-transparent outline-none font-black text-2xl transition"
                      placeholder="Map/Location URL"
                      value={breweryForm.location}
                      onChange={(e) =>
                        setBreweryForm({
                          ...breweryForm,
                          location: e.target.value,
                        })
                      }
                      required
                    />
                    <textarea
                      className="w-full p-7 bg-gray-50 rounded-[2rem] h-48 focus:border-[#00B5B5] border-4 border-transparent outline-none font-bold text-xl transition"
                      placeholder="Description"
                      value={breweryForm.description}
                      onChange={(e) =>
                        setBreweryForm({
                          ...breweryForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />

                    <div className="flex gap-4">
                      {editingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setActiveTab("store");
                          }}
                          className="flex-1 py-7 bg-gray-100 text-gray-500 font-black rounded-[2rem] hover:bg-gray-200 transition"
                        >
                          CANCEL
                        </button>
                      )}
                      <button
                        disabled={uploading}
                        className={`flex-[2] py-7 text-white font-black text-2xl rounded-[2rem] shadow-2xl transition active:scale-95 ${editingId ? "bg-[#F08E1E]" : "bg-[#00B5B5]"}`}
                      >
                        {uploading
                          ? "SAVING..."
                          : editingId
                            ? "SAVE CHANGES"
                            : "ADD BREWERY"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 4. BREWERY STORE (Matching reference image) */}
            {activeTab === "store" && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-12">
                  <h1 className="text-5xl font-black tracking-tighter">
                    Brewery Store
                  </h1>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setPreviewUrl(null);
                      setActiveTab("register");
                    }}
                    className="flex items-center gap-2 px-8 py-4 bg-[#00B5B5] text-white rounded-2xl font-black shadow-lg hover:scale-105 transition"
                  >
                    <PlusCircle size={20} /> New Brand
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {breweries.map((b) => (
                    <div
                      key={b._id}
                      className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#00B5B5] hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="flex gap-10 items-center">
                        <div className="w-40 h-40 relative bg-gray-50 rounded-[2.5rem] overflow-hidden border-2 border-gray-100 group-hover:border-[#00B5B5]/20 transition-colors shadow-inner">
                          <Image
                            src={b.logoUrl}
                            alt="logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-3">
                            <h4 className="text-4xl font-black tracking-tight">
                              {b.name}
                            </h4>
                            <a
                              href={b.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-[#E6F7F7] text-[#00B5B5] rounded-xl hover:bg-[#00B5B5] hover:text-white transition-all"
                            >
                              <MapPin size={24} />
                            </a>
                          </div>
                          <p className="text-gray-400 font-bold max-w-xl leading-relaxed italic line-clamp-2">
                            "{b.description}"
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 pr-4">
                        <button
                          onClick={() => startEdit(b)}
                          className="p-6 bg-[#FFF4E5] text-[#F08E1E] rounded-[2rem] hover:bg-[#F08E1E] hover:text-white transition-all shadow-lg hover:rotate-3"
                        >
                          <Edit2 size={28} />
                        </button>
                        <button
                          onClick={() => deleteBrewery(b._id)}
                          className="p-6 bg-red-50 text-red-500 rounded-[2rem] hover:bg-red-500 hover:text-white transition-all shadow-lg hover:-rotate-3"
                        >
                          <Trash2 size={28} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* RESET MODAL */}
      {resetModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1A3C5A]/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center">
            <h3 className="text-4xl font-black mb-4">Reset System?</h3>
            <p className="text-gray-500 mb-10 font-bold text-lg leading-tight">
              This will permanently delete all votes.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setResetModal(false)}
                className="flex-1 py-5 bg-gray-100 text-gray-700 font-black rounded-3xl transition hover:bg-gray-200"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  await fetch("/api/admin/votes", { method: "DELETE" });
                  setVotes([]);
                  setResetModal(false);
                  showToast("System Reset");
                }}
                className="flex-1 py-5 bg-red-600 text-white font-black rounded-3xl transition shadow-xl hover:bg-red-700"
              >
                RESET NOW
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
