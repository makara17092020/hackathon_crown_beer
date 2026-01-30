"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { CheckCircle, Loader2, Send, Star } from "lucide-react";

const BREWERY_BEER_MAP: Record<string, string[]> = {
  "Fungi Art": [
    "IPA",
    "Sake Saison",
    "Lager Beer",
    "Brut IPA",
  ],
  "Mozzie's": [
    "New England Hazy IPA",
    "Citra Pale Ale",
    "Wheat Beer",
  ],
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
    "Raspberry Ale",
    "Belgian Wit",
    "Ignazius Triple",
    "Ngam Ngov Fermented Limes",
    "Milkshake IPA",
  ],
  "Project Brews": [
    "Saturated in Simcoe – West Coast IPA",
    "Southern Pinwheel – Pale Ale",
    "She Told Me She Was Pretty – Raspberry Sour",
    "Roots – Extra Strong Bitter",
    "PB&J – Sour",
    "Sundog – Hazy IPA",
    "Kampot Pepper & Lemongrass – Blonde Ale",
    "Kampot Long Red Pepper, Ginger & Dragon Fruit – Spiced Ale",
  ],
  Himawari: [
    "Apsara Gold",
    "After Eight Porter"
  ],
  Botanico: [
    "Krush It! – Session IPA",
    "Slash – Juicy IPA",
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
    "Silver Angel – Light Lager",
    "Gold Angel – Lager",
    "Amber Witch – German Wheat",
    "Imperial IPA",
    "Bash Special",
  ],
  "Fuzzy Logic": [
    "Winter Ale",
    "Pale Ale",
    "Thunderslap IPA",
    "Apsara Cider",
  ],
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
    "Backstage IPA – Westcoast IPA",
    "Mango Reigns – Mango IPA",
    "Wings – Session IPA",
    "Ship of the Fens – English Pale Ale",
  ],
};

interface Brewery {
  _id: string;
  name: string;
  logoUrl: string;
}

export default function VoteForm() {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [selectedBreweryId, setSelectedBreweryId] = useState("");
  const [selectedBeer, setSelectedBeer] = useState("");
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("voteSessionId");
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("voteSessionId", id);
    }
    setSessionId(id);
  }, []);

  useEffect(() => {
    async function loadBreweries() {
      try {
        const res = await fetch("/api/admin/breweries");
        if (!res.ok) throw new Error();
        setBreweries(await res.json());
      } catch {
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

  const currentBeerList = useMemo(() => {
    if (!selectedBrewery) return [];
    // Normalization to handle Fungi vs Funghi and spacing
    const dbName = selectedBrewery.name.toLowerCase().replace(/h/g, "").trim();
    const matchKey = Object.keys(BREWERY_BEER_MAP).find((key) => {
      const cleanKey = key.toLowerCase().replace(/h/g, "").trim();
      return (
        cleanKey === dbName ||
        cleanKey.includes(dbName) ||
        dbName.includes(cleanKey)
      );
    });
    return matchKey ? BREWERY_BEER_MAP[matchKey] : [];
  }, [selectedBrewery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBreweryId || !selectedBeer) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: sessionId,
          productId: selectedBreweryId,
          brewery: selectedBrewery?.name,
          beerName: selectedBeer,
          rating,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setErrorMsg("Submission failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (loadingList)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#00B5B5] w-12 h-12" />
      </div>
    );

  if (done)
    return (
      <div className="p-10 bg-white shadow-2xl rounded-[2.5rem] text-center border-2 border-[#00B5B5]/20 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[#00B5B5]/10 text-[#00B5B5] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">
          Vote Recorded!
        </h3>
        <p className="text-gray-500 mb-8 text-lg font-medium">
          Your rating for{" "}
          <span className="text-[#00B5B5] underline decoration-wavy underline-offset-4">
            {selectedBeer}
          </span>{" "}
          is in.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setSelectedBreweryId("");
            setSelectedBeer("");
          }}
          className="w-full py-5 bg-[#00B5B5] text-white font-black rounded-2xl shadow-xl shadow-[#00B5B5]/20 hover:scale-[1.02] transition-transform"
        >
          VOTE FOR ANOTHER
        </button>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-12 pb-20 px-4"
    >
      {/* STEP 1: BREWERY */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#00B5B5] text-white flex items-center justify-center text-lg font-black shadow-lg shadow-[#00B5B5]/20">
            1
          </div>
          <h2 className="text-2xl font-black text-[#00B5B5] uppercase tracking-tight">
            Choose Brewery
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {breweries.map((b) => {
            const isActive = selectedBreweryId === b._id;
            return (
              <button
                key={b._id}
                type="button"
                onClick={() => {
                  setSelectedBreweryId(b._id);
                  setSelectedBeer("");
                }}
                className={`group relative p-5 rounded-[2rem] transition-all duration-300 border-2 text-center bg-white ${isActive ? "border-[#00B5B5] ring-4 ring-[#00B5B5]/10 shadow-xl scale-105" : "border-[#00B5B5]/10 shadow-sm hover:border-[#00B5B5]/40"}`}
              >
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <Image
                    src={b.logoUrl}
                    alt={b.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p
                  className={`text-[10px] font-black uppercase tracking-wider leading-tight ${isActive ? "text-[#00B5B5]" : "text-[#00B5B5]/40 group-hover:text-[#00B5B5]"}`}
                >
                  {b.name}
                </p>
                {isActive && (
                  <div className="absolute -top-2 -right-2 bg-[#00B5B5] text-white p-1.5 rounded-full shadow-md">
                    <CheckCircle size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 2: BEER */}
      {selectedBrewery && (
        <section className="animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#00B5B5] text-white flex items-center justify-center text-lg font-black shadow-lg shadow-[#00B5B5]/20">
              2
            </div>
            <h2 className="text-2xl font-black text-[#00B5B5] uppercase tracking-tight">
              Select Drink
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {currentBeerList.length > 0 ? (
              currentBeerList.map((beer) => (
                <button
                  key={beer}
                  type="button"
                  onClick={() => setSelectedBeer(beer)}
                  className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${selectedBeer === beer ? "bg-[#00B5B5] border-[#00B5B5] text-white shadow-xl scale-105" : "bg-white border-[#00B5B5]/20 text-gray-600 hover:border-[#00B5B5]/40"}`}
                >
                  {beer}
                </button>
              ))
            ) : (
              <div className="w-full p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-gray-500 text-sm font-medium text-center">
                Taps are being updated...
              </div>
            )}
          </div>
        </section>
      )}

      {/* STEP 3: NEW MODERN RATING */}
      {selectedBeer && (
        <section className="animate-in slide-in-from-bottom-10 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#00B5B5] text-white flex items-center justify-center text-lg font-black shadow-lg shadow-[#00B5B5]/20">
              3
            </div>
            <h2 className="text-2xl font-black text-[#00B5B5] uppercase tracking-tight">
              Rate Experience
            </h2>
          </div>

          <div className="relative overflow-hidden bg-white rounded-[3rem] p-10 text-center border-2 border-[#00B5B5]/10 shadow-[0_20px_50px_rgba(0,181,181,0.1)]">
            {/* Decorative Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00B5B5]/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="text-7xl font-black text-[#00B5B5] mb-8 tracking-tighter drop-shadow-sm">
              {rating}
              <span className="text-2xl text-[#00B5B5]/30 font-bold ml-1">
                / 10
              </span>
            </div>

            <div className="relative px-2">
              <input
                type="range"
                min={1}
                max={10}
                value={rating}
                onChange={(e) => setRating(+e.target.value)}
                className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#00B5B5] hover:accent-[#009999] transition-all"
              />
              {/* Visual labels under slider */}
              <div className="flex justify-between mt-6 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${rating >= n ? "bg-[#00B5B5] scale-150" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-[#00B5B5]/50 tracking-[0.25em] font-sans">
              <span>Not for me</span>
              <span>The Best!</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full mt-10 py-7 bg-gradient-to-br from-[#00B5B5] via-[#00B5B5] to-[#009999] text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-[#00B5B5]/40 flex items-center justify-center gap-4 transition-all hover:scale-[1.01] hover:shadow-[#00B5B5]/50 active:scale-[0.98]"
          >
            {sending ? (
              <Loader2 className="animate-spin w-8 h-8" />
            ) : (
              <>
                <Send size={28} /> Confirm Vote
              </>
            )}
          </button>
        </section>
      )}
    </form>
  );
}
