"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { CheckCircle, Loader2, Send } from "lucide-react";

// --- DATA: Beer Menu mapped to Brewery Name (From your Sheet) ---
// Note: The keys here must match the 'name' coming from your API exactly.
const BREWERY_BEER_MAP: Record<string, string[]> = {
  "Fungi Art": ["IPA", "Sake Saison", "Lager Beer", "Brut IPA"],
  "Mozzie's": ["New England Hazy IPA", "Citra Pale Ale", "Wheat Beer"],
  "Sak Pub": [
    "Happy Hazy IPA",
    "Amarillo Cascade IPA",
    "Sok Sabay IPA",
    "Vanilla Porter",
  ],
  "Black Bamboo": [
    "Sambucus Elderflower IPA",
    "Hops Wave IPA",
    "Lotus IPA",
    "Milkyway Stout",
    "Lemondrop Pils",
    "Rasberry Ale",
    "Belgian Wit",
    "Ignazius Triple",
    "Ngam Ngov Fermented Limes",
    "Milkshake IPA",
  ],
  "Project Brews": [
    "Saturated in Simcoe - West Coast IPA",
    "Southern Pinewheel - Pale Ale",
    "She Told Me She Was Pretty - Raspberry Sour",
    "Roots - Extra Strong Bitter",
    "PB&J - Sour",
    "Sundog - Hazy IPA",
    "Kampot Pepper & Lemongrass - Blonde Ale",
    "Kampot Long Red Pepper, Ginger & Dragon Fruit - Spiced Ale",
  ],
  Himawari: ["Apsara Gold", "After Eight Porter"],
  Botanico: [
    "Krush it! - Session IPA",
    "Slash - Juicy IPA",
    "Hoppy Lager",
    "Centurion American Pale Ale",
    "Khmer Honey Blonde",
    "After Eight Porter",
  ],
  Krama: [
    "Summer Blonde",
    "Amber Ale",
    "Black IPA",
    "Golden Pale Ale",
    "Triple Khmer",
    "Barley Wine",
  ],
  "Bash Brewing": [
    "Silver Angel - Light Lager",
    "Gold Angel - Lager",
    "Amber Witch - German Wheet",
    "Imperial IPA",
    "Bash Special",
    "Winter Ale",
  ],
  "Fuzzy Logic": ["Pale Ale", "Thunderslap IPA", "Apsara Cider"],
  "Riel Brewing": [
    "West Coast IPA",
    "Citra Pale Ale",
    "New England IPA",
    "Ginger Beer",
    "Raspberry Berliner Weisse",
    "Non-alcoholic Pale Ale",
  ],
  "Stone Head": [
    "Seven Days Witbier",
    "Lemongrass Kolsch",
    "Gancore IPA",
    "Smiling Evil Pale Ale",
    "Red Bus Amber",
  ],
  "Brew Khnear": [
    "Backstage IPA - Westcoast IPA",
    "Mango Reigns - Mango IPA",
    "Wings - Session IPA",
    "Ship of the Fens - English Pale Ale",
  ],
};

interface Brewery {
  _id: string;
  name: string;
  logoUrl: string;
  description: string;
}

export default function VoteForm() {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [selectedBreweryId, setSelectedBreweryId] = useState<string>("");
  const [selectedBeer, setSelectedBeer] = useState<string>(""); // New State for Beer
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem("voteSessionId");
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("voteSessionId", id);
    }
    setSessionId(id);
  }, []);

  // Fetch Breweries
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

  // Helpers
  const selectedBrewery = useMemo(
    () => breweries.find((b) => b._id === selectedBreweryId),
    [selectedBreweryId, breweries],
  );

  const getRatingEmoji = (val: number) => {
    if (val <= 2) return "💀";
    if (val <= 4) return "😐";
    if (val <= 6) return "😊";
    if (val <= 8) return "🍻";
    if (val <= 9) return "🔥";
    return "👑";
  };

  // Get Beer List for current selection
  const currentBeerList = useMemo(() => {
    if (!selectedBrewery) return [];
    // Try to find the beer list matching the brewery name
    return BREWERY_BEER_MAP[selectedBrewery.name] || [];
  }, [selectedBrewery]);

  // Submit Vote
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBreweryId || !selectedBeer || !sessionId) return;

    setSending(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: sessionId,
          productId: selectedBreweryId,
          brewery: selectedBrewery?.name,
          beerName: selectedBeer, // Sending the specific beer name
          rating,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDone(true);
      } else {
        setErrorMsg(data.error || "Submission failed");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  // Handle Brewery Change (Reset subsequent steps)
  const handleBreweryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreweryId(e.target.value);
    setSelectedBeer(""); // Reset beer
    setRating(5); // Reset rating
    setErrorMsg(null);
  };

  if (loadingList)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-[#00B5B5]" />
      </div>
    );

  if (done)
    return (
      <div className="p-8 bg-[#00B5B5]/10 border-2 border-[#00B5B5]/30 rounded-3xl text-center animate-fadeIn">
        <CheckCircle className="w-16 h-16 text-[#00B5B5] mx-auto mb-4" />
        <h3 className="text-2xl font-black text-[#1A3C5A] mb-2">
          Vote Recorded! ✓
        </h3>
        <p className="text-[#1A3C5A] text-lg">
          You rated <strong>{selectedBeer}</strong> by {selectedBrewery?.name} a{" "}
          {rating}/10 {getRatingEmoji(rating)}
        </p>
        <button
          onClick={() => {
            setDone(false);
            setSelectedBreweryId("");
            setSelectedBeer("");
            setRating(5);
          }}
          className="mt-8 font-black text-[#00B5B5] underline hover:text-[#009999] transition-colors"
        >
          Vote for another brew
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

      {/* --- Step 1: Select Brewery --- */}
      <div className="group animate-fadeIn" style={{ animationDelay: "0ms" }}>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
          Step 1: Choose Brewery
        </label>
        <select
          value={selectedBreweryId}
          onChange={handleBreweryChange}
          className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#00B5B5] focus:bg-white outline-none transition-all appearance-none cursor-pointer font-bold text-gray-700"
        >
          <option value="">🍺 Select a booth...</option>
          {breweries.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* --- Step 2: Select Beer (Only shows if Brewery is Selected) --- */}
      {selectedBrewery && (
        <div
          className="group animate-fadeIn"
          style={{ animationDelay: "100ms" }}
        >
          {/* Optional: Show Brewery Info Card */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
              <Image
                src={selectedBrewery.logoUrl}
                alt="logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">
                {selectedBrewery.name}
              </h4>
              <p className="text-xs text-gray-500">Select a beer below</p>
            </div>
          </div>

          <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            Step 2: Choose Beer
          </label>
          <select
            value={selectedBeer}
            onChange={(e) => setSelectedBeer(e.target.value)}
            className="w-full p-5 bg-white border-2 border-[#00B5B5]/30 rounded-2xl focus:border-[#00B5B5] outline-none transition-all appearance-none cursor-pointer font-bold text-gray-800 shadow-sm"
          >
            <option value="">🍻 Select which beer...</option>
            {currentBeerList.length > 0 ? (
              currentBeerList.map((beer, idx) => (
                <option key={idx} value={beer}>
                  {beer}
                </option>
              ))
            ) : (
              <option disabled>No beer list found for this brewery</option>
            )}
          </select>
        </div>
      )}

      {/* --- Step 3: Rate (Only shows if Beer is Selected) --- */}
      {selectedBrewery && selectedBeer && (
        <div
          className="animate-fadeIn space-y-8"
          style={{ animationDelay: "200ms" }}
        >
          <div className="bg-gradient-to-br from-[#F08E1E]/10 to-[#F08E1E]/5 p-8 rounded-3xl border-2 border-[#F08E1E]/20 text-center">
            <label className="block text-xs font-black text-[#F08E1E] uppercase tracking-[0.2em] mb-6">
              Step 3: Rate {selectedBeer}
            </label>

            <div className="text-7xl mb-4 transition-all duration-300 transform hover:scale-125">
              {getRatingEmoji(rating)}
            </div>

            <div className="text-4xl font-black text-[#F08E1E] mb-8">
              {rating}{" "}
              <span className="text-lg text-[#F08E1E]/60 font-medium">
                / 10
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full h-4 rounded-xl appearance-none cursor-pointer accent-[#F08E1E]"
              style={{
                background: `linear-gradient(to right, #f87171, #F08E1E, #4ade80)`,
              }}
            />
            <div className="flex justify-between text-[11px] font-black text-[#F08E1E]/60 mt-4 px-1 uppercase tracking-wider">
              <span>Meh</span>
              <span>Good</span>
              <span>Amazing!</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-5 bg-gradient-to-r from-[#00B5B5] to-[#009999] hover:from-[#00A0A0] hover:to-[#008080] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#00B5B5]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send size={20} />
                Vote for {selectedBeer}
              </>
            )}
          </button>
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
