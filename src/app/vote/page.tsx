"use client";

import VoteForm from "@/components/VoteForm";
import { Star, Beer } from "lucide-react";

export default function VotePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 sm:px-6 py-12">
      <section className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beer className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Vote for Your Favorite Beer
            </h1>
            <Star className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-lg text-gray-700 font-medium">
            Help us crown the best beer at the Great Cambodian Craft Beer Festival 2026
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🍺</span>
              Easy 3-Step Voting
            </h2>
          </div>
          <div className="p-8 sm:p-10">
            <VoteForm />
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">?</span>
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-3">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Choose Brewery</h4>
              <p className="text-sm text-gray-700">Select from our amazing list of participating breweries</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-3">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Pick a Beer</h4>
              <p className="text-sm text-gray-700">Select the specific beer from that brewery you tasted</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-3">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Rate It</h4>
              <p className="text-sm text-gray-700">Rate on a scale of 1-10 and submit your vote</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-blue-200">
            <p className="text-sm text-blue-900 font-semibold flex items-center gap-2">
              <span>💡</span>
              Pro Tip: You can vote for multiple beers! Feel free to vote for your favorite from each brewery.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
