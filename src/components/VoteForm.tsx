"use client";
import { useState, useMemo } from "react";
import { BEERS } from "@/utils/beers";
import { submitBeerVote } from "@/lib/actions/Vote";

interface VoteFormProps {
  userEmail: string | null | undefined;
}

const BREWERIES = Array.from(new Set(BEERS.map((beer) => beer.brewery))).sort();

export default function VoteForm({ userEmail }: VoteFormProps) {
  const [selectedBrewery, setSelectedBrewery] = useState<string>("");
  const [selectedBeer, setSelectedBeer] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const breweryBeers = useMemo(() => {
    if (!selectedBrewery) return [];
    return BEERS.filter((beer) => beer.brewery === selectedBrewery).sort(
      (a, b) => a.name.localeCompare(b.name),
    );
  }, [selectedBrewery]);

  const handleBreweryChange = (brewery: string) => {
    setSelectedBrewery(brewery);
    setSelectedBeer("");
    setErrorMsg(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBrewery || !selectedBeer || !userEmail) return;

    setSending(true);
    setErrorMsg(null);

    const beerData = BEERS.find((b) => b.id === selectedBeer);

    const result = await submitBeerVote({
      userEmail,
      productId: selectedBeer,
      beerName: beerData?.name || "Unknown",
      brewery: selectedBrewery,
      rating,
    });

    if (result.success) {
      setDone(true);
    } else {
      setErrorMsg(result.message || "Failed to submit vote.");
    }
    setSending(false);
  }

  if (done)
    return (
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-md animate-fadeIn">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✨</span>
          <h3 className="text-lg font-bold text-green-800">Vote Recorded!</h3>
        </div>
        <p className="text-gray-700">
          Thanks for voting for{" "}
          <strong className="text-green-700">
            {BEERS.find((b) => b.id === selectedBeer)?.name}
          </strong>
          ! Your rating of{" "}
          <strong className="text-green-700">{rating}/10</strong> has been saved
          to our database.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setSelectedBeer("");
          }}
          className="mt-4 text-green-600 font-bold underline hover:text-green-700"
        >
          Vote for another beer
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg text-sm font-bold animate-shake">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Step 1: Brewery Selection */}
      <div className="group">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-600 rounded-full">
            1
          </span>
          <label className="block text-base font-bold text-gray-800">
            Select a Brewery
          </label>
        </div>
        <select
          value={selectedBrewery}
          onChange={(e) => handleBreweryChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 font-medium hover:border-green-400 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
        >
          <option value="">🍺 Choose a brewery...</option>
          {BREWERIES.map((brewery) => (
            <option key={brewery} value={brewery}>
              {brewery}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Beer Selection */}
      {selectedBrewery && (
        <div className="group animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-600 rounded-full">
              2
            </span>
            <label className="block text-base font-bold text-gray-800">
              Select a Beer from {selectedBrewery}
            </label>
          </div>
          <select
            value={selectedBeer}
            onChange={(e) => setSelectedBeer(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 font-medium hover:border-green-400 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
          >
            <option value="">🍻 Choose a beer...</option>
            {breweryBeers.map((beer) => (
              <option key={beer.id} value={beer.id}>
                {beer.name} • {beer.style}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Rating */}
      {selectedBeer && (
        <div className="group animate-fadeIn bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-lg border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-600 rounded-full">
              3
            </span>
            <label className="block text-base font-bold text-gray-800">
              Rate Your Experience
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
              <span>👎 Not good</span>
              <span>👍 Excellent</span>
            </div>

            <input
              type="range"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f87171 0%, #fbbf24 40%, #4ade80 100%)`,
              }}
            />

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Your rating:
              </span>
              <div className="inline-flex items-center justify-center w-12 h-12 text-2xl font-bold text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                {rating}
              </div>
              <span className="text-sm font-semibold text-gray-700">/10</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {selectedBeer && (
        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <span className="animate-spin">⏳</span>
              Saving to Database...
            </>
          ) : (
            <>
              <span>✓</span>
              Submit My Vote
            </>
          )}
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </form>
  );
}
