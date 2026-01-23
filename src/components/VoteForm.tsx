"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { CheckCircle, Loader2, Send } from "lucide-react";

interface Brewery {
  _id: string;
  name: string;
  logoUrl: string;
  description: string;
}

export default function VoteForm({
  userEmail,
}: {
  userEmail: string | null | undefined;
}) {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [selectedBreweryId, setSelectedBreweryId] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);

  // Dynamic Emoji based on the rating slider
  const getRatingEmoji = (val: number) => {
    if (val <= 2) return "...";
    if (val <= 4) return "😐";
    if (val <= 6) return "😊";
    if (val <= 8) return "🍻";
    if (val <= 9) return "🔥";
    return "👑";
  };

  // 1. Fetch Breweries from your Admin API
  useEffect(() => {
    async function loadBreweries() {
      try {
        const res = await fetch("/api/admin/breweries");
        if (res.ok) setBreweries(await res.json());
      } catch (err) {
        setErrorMsg("Failed to load festival lineup.");
      } finally {
        setLoadingList(false);
      }
    }
    loadBreweries();
  }, []);

  const selectedBrewery = useMemo(
    () => breweries.find((b) => b._id === selectedBreweryId),
    [selectedBreweryId, breweries],
  );

  // 2. Submit Vote to the path: /api/admin/votes
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBreweryId || !userEmail) return;

    setSending(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          productId: selectedBreweryId,
          beerName: selectedBrewery?.name,
          brewery: selectedBrewery?.name,
          rating,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDone(true);
      } else {
        // Handle "Already voted" or server errors
        setErrorMsg(data.error || "Submission failed");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (loadingList)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-green-600" />
      </div>
    );

  if (done)
    return (
      <div className="p-8 bg-green-50 border-2 border-green-200 rounded-3xl text-center animate-fadeIn">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-green-900 mb-2">
          Vote Recorded!
        </h3>
        <p className="text-green-700 text-lg">
          You gave <strong>{selectedBrewery?.name}</strong> a {rating}/10{" "}
          {getRatingEmoji(rating)}
        </p>
        <button
          onClick={() => {
            setDone(false);
            setSelectedBreweryId("");
            setRating(5);
          }}
          className="mt-8 font-black text-green-600 underline hover:text-green-800 transition-colors"
        >
          Vote for another booth
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold animate-shake">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Step 1: Select Brewery */}
      <div className="group">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
          Step 1: Choose Brewery
        </label>
        <select
          value={selectedBreweryId}
          onChange={(e) => {
            setSelectedBreweryId(e.target.value);
            setErrorMsg(null);
          }}
          className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer font-bold text-gray-700"
        >
          <option value="">🍺 Select a booth...</option>
          {breweries.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBrewery && (
        <div className="animate-fadeIn space-y-8">
          {/* Brewery Card Preview */}
          <div className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
              <Image
                src={selectedBrewery.logoUrl}
                alt="logo"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-xl text-gray-900 truncate">
                {selectedBrewery.name}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2 leading-tight mt-1">
                {selectedBrewery.description}
              </p>
            </div>
          </div>

          {/* Step 2: Emoji Rating Slider */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-3xl border-2 border-amber-100 text-center">
            <label className="block text-xs font-black text-amber-800 uppercase tracking-[0.2em] mb-6">
              Step 2: Rate Your Experience
            </label>

            <div className="text-7xl mb-4 transition-all duration-300 transform hover:scale-125">
              {getRatingEmoji(rating)}
            </div>

            <div className="text-4xl font-black text-amber-600 mb-8">
              {rating}{" "}
              <span className="text-lg text-amber-400 font-medium">/ 10</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full h-4 rounded-xl appearance-none cursor-pointer accent-amber-600"
              style={{
                background: `linear-gradient(to right, #f87171, #fbbf24, #4ade80)`,
              }}
            />
            <div className="flex justify-between text-[11px] font-black text-amber-400 mt-4 px-1 uppercase tracking-wider">
              <span>Not Good</span>
              <span>Average</span>
              <span>Masterpiece!</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send size={20} />
                Submit My Vote
              </>
            )}
          </button>
        </div>
      )}

      {/* Internal Styles for Animations */}
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
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          75% {
            transform: translateX(6px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </form>
  );
}
