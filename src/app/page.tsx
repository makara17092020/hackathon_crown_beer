"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full Page Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/6/69/Beer_glasses.jpg')",
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center py-8 px-4 animate-fadeIn">
        {/* Hero Section */}
        <section className="w-full max-w-6xl relative rounded-2xl overflow-hidden shadow-xl min-h-[420px] flex items-center justify-center mb-12 animate-slideUp delay-100">
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-transparent z-10 backdrop-blur-sm" />
          <div className="relative z-20 w-full flex flex-col md:flex-row items-center gap-10 md:gap-16 p-6 md:p-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A3C5A] leading-tight drop-shadow-lg">
                Great Cambodian Craft Beer <br />
                <span className="text-[#00B5B5]">Festival 2026</span>
              </h1>
              <p className="text-lg md:text-xl text-[#1A3C5A] drop-shadow">
                Join us for Cambodia&apos;s premier craft beer festival
                featuring{" "}
                <span className="font-semibold text-[#00B5B5]">
                  12 exceptional breweries
                </span>{" "}
                and live entertainment.
              </p>

              {/* Event Details */}
              <div className="bg-[#00B5B5]/10 rounded-xl shadow-lg p-6 flex flex-col gap-4 max-w-md transition-transform hover:scale-[1.02] hover:shadow-xl duration-300">
                <div className="flex items-center gap-3 text-[#1A3C5A]">
                  <span className="text-[#00B5B5] text-2xl animate-bounce">
                    🗓️
                  </span>
                  <span className="font-semibold">January 31, 2026</span>
                </div>
                <div className="flex items-center gap-3 text-[#1A3C5A]">
                  <span className="text-[#00B5B5] text-2xl animate-pulse">
                    ⏰
                  </span>
                  <span>2:00 PM – 12:00 AM</span>
                </div>
                <div className="flex items-center gap-3 text-[#1A3C5A]">
                  <span className="text-[#00B5B5] text-2xl">📍</span>
                  <div>
                    <span className="font-semibold">Coconut Park Koh Pich</span>
                    <div className="text-sm text-[#1A3C5A]/60">Phnom Penh</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4 mt-2 flex-wrap">
                <Link
                  href="/vote"
                  className="bg-[#F08E1E] hover:bg-[#E07D0D] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                >
                  🍺 VOTE NOW
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Event Highlights */}
        <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Meet the Breweries",
              text: "Discover 14 incredible breweries from across Cambodia and learn their unique stories.",
              link: "/breweries",
            },
            {
              title: "Event Schedule",
              text: "Check out the live music, DJ sets, and award ceremonies scheduled throughout the day.",
              link: "/schedule",
            },
            {
              title: "Vote Now",
              text: "Share your favorite beer and help us crown the winner of the festival.",
              link: "/vote",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/90 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform hover:scale-105 duration-300 backdrop-blur-sm animate-slideUp"
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            >
              <h3 className="text-xl font-bold text-[#00B5B5] mb-2">
                {item.title}
              </h3>
              <p className="mb-3 text-[#1A3C5A]">{item.text}</p>
              <Link
                href={item.link}
                className="text-[#F08E1E] font-semibold hover:underline"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </section>
      </main>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
