"use client";
import VoteForm from "@/components/VoteForm";
import {
  Star,
  Beer,
  CheckCircle2,
  Lightbulb,
  Trophy,
  Loader2,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function VotePage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 sm:px-6 py-12">
      <section className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beer className="w-10 h-10 text-green-600 animate-bounce" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Beer Crown 2026
            </h1>
            <Star className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <p className="text-lg text-gray-700 font-medium max-w-xl mx-auto">
            Help us crown the best brew at the Great Cambodian Craft Beer
            Festival!
          </p>
        </div>

        {/* Main Voting Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-green-100">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-300" />
              {session
                ? `Welcome, ${session.user?.name?.split(" ")[0]}`
                : "Sign in to Participate"}
            </h2>
          </div>

          <div className="p-8 sm:p-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin h-12 w-12 text-green-600 mb-4" />
                <p className="text-green-700 font-medium">Authenticating...</p>
              </div>
            ) : session ? (
              <VoteForm userEmail={session.user?.email} />
            ) : (
              <div className="text-center py-6">
                <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-600 mb-8 text-lg">
                  To ensure a fair competition (one vote per brewery), please
                  authenticate with Google.
                </p>
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center gap-3 mx-auto bg-white border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-gray-700 hover:border-green-500 hover:bg-green-50 transition-all shadow-sm transform hover:scale-105"
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    className="w-6 h-6"
                    alt="Google"
                  />
                  Continue with Gmail
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
              <CheckCircle2 className="text-green-600 w-5 h-5" />
              How to Vote
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="font-bold text-green-600">01.</span> Select the
                brewery you just visited.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600">02.</span> Use the
                slider to rate your experience.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-600">03.</span> Submit to
                save your vote to the leaderboard.
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-lg border border-amber-100">
            <h3 className="flex items-center gap-2 font-bold text-amber-800 mb-4">
              <Lightbulb className="text-amber-600 w-5 h-5" />
              Pro-Tips
            </h3>
            <p className="text-sm text-amber-900/80 leading-relaxed">
              You can vote for every different booth in the festival, but you
              can only rate each specific brewery once!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
