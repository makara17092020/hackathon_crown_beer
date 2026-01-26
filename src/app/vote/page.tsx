"use client";
import VoteForm from "@/components/VoteForm";
import {
  Star,
  Beer,
  CheckCircle2,
  Lightbulb,
  Trophy,
} from "lucide-react";

export default function VotePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#00B5B5]/10 via-white to-[#00B5B5]/5 px-4 sm:px-6 py-12">
      <section className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beer className="w-10 h-10 text-[#00B5B5] animate-bounce" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00B5B5] to-[#009999]">
              Beer Crown 2026
            </h1>
            <Star className="w-10 h-10 text-[#F08E1E] animate-pulse" />
          </div>
          <p className="text-lg text-gray-700 font-medium max-w-xl mx-auto">
            Help us crown the best brew at the Great Cambodian Craft Beer
            Festival!
          </p>
        </div>

        {/* Main Voting Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-[#00B5B5]/20">
          <div className="bg-gradient-to-r from-[#00B5B5] to-[#009999] px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-300" />
              Ready to Vote?
            </h2>
          </div>

          <div className="p-8 sm:p-10">
            <VoteForm />
          </div>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#00B5B5]/10">
            <h3 className="flex items-center gap-2 font-bold text-[#1A3C5A] mb-4">
              <CheckCircle2 className="text-[#00B5B5] w-5 h-5" />
              How to Vote
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="font-bold text-[#00B5B5]">01.</span> Select the
                brewery you just visited.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#00B5B5]">02.</span> Use the
                slider to rate your experience.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#00B5B5]">03.</span> Submit to
                save your vote to the leaderboard.
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#F08E1E]/10 to-[#F08E1E]/5 p-6 rounded-2xl shadow-lg border border-[#F08E1E]/20">
            <h3 className="flex items-center gap-2 font-bold text-[#F08E1E] mb-4">
              <Lightbulb className="text-[#F08E1E] w-5 h-5" />
              Pro-Tips
            </h3>
            <p className="text-sm text-[#1A3C5A]/80 leading-relaxed">
              You can vote for every different booth in the festival, but you
              can only rate each specific brewery once!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
