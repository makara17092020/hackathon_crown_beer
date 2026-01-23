"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";

type Brewery = {
  _id: string;
  name: string;
  description: string;
  location: string;
  logoUrl: string;
};

export default function BreweriesPage() {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBreweries() {
      try {
        const res = await fetch("/api/admin/breweries");
        if (res.ok) setBreweries(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getBreweries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
        <p className="text-green-800 font-bold">Loading Festival Lineup...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 sm:px-6 py-10">
      <section className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-green-800 mb-4">
            Participating Breweries
          </h1>
          <p className="text-green-600 font-bold uppercase tracking-widest text-sm">
            Coconut Park Koh Pich • 2026
          </p>
        </header>

        {breweries.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {breweries.map((brewery, index) => (
              <motion.div
                key={brewery._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2rem] shadow-sm border border-green-100 overflow-hidden hover:shadow-xl transition-all flex flex-col"
              >
                {/* Logo Area */}
                <div className="relative w-full h-56 bg-gray-50 flex items-center justify-center p-8">
                  <Image
                    src={brewery.logoUrl}
                    alt={brewery.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow text-center">
                  <h2 className="text-2xl font-black text-gray-900 mb-4">
                    {brewery.name}
                  </h2>

                  {/* Clean Description (No raw URL here) */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                    {brewery.description}
                  </p>

                  {/* Primary Action Button using the saved Location URL */}
                  <a
                    href={brewery.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MapPin size={20} /> Find Booth
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed text-gray-400 font-bold">
            Stay tuned! More breweries are joining the festival soon.
          </div>
        )}
      </section>
    </main>
  );
}
