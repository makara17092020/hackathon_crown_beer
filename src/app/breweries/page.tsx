"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const breweries = [
  {
    name: "Sak Pub",
    description:
      "Serving handcrafted small batch beers in a welcoming atmosphere since 2021.",
    image: "/images/sakpub.png",
    mapUrl: "https://maps.app.goo.gl/VGkZoR5f79XSMmqS9?g_st=com.google.maps.preview.copy",
  },
  {
    name: "Project Brews",
    description:
      "A Kampot-based microbrewery making modern hoppy beers since 2020.",
    image: "/images/projectbrews.png",
    mapUrl: "https://maps.app.goo.gl/v8cwyxUo3nMmysmD6?g_st=com.google.maps.preview.copy",
  },
  {
    name: "Black Bamboo",
    description:
      "First island craft brewery in Cambodia, located on Silk Island with river views.",
    image: "/images/Blackbamboo.png",
    mapUrl: "https://maps.app.goo.gl/KtwzA5PXxKC8GHTo6?g_st=com.google.maps.preview.copy",
  },
  {
    name: "Botanico Brewing Company",
    description:
      "One of the oldest breweries in Phnom Penh, creating beers with local ingredients.",
    image: "/images/botanico.png",
    mapUrl: "https://maps.app.goo.gl/bmEnWU2s7zjzXjJo7?g_st=com.google.maps.preview.copy",
  },
  {
    name: "Riel Brewing and Distilling",
    description:
      "Pioneers in Cambodia's craft beer scene with creative, high-quality recipes.",
    image: "/images/rielbrewing.png",
    mapUrl: "https://maps.app.goo.gl/jGDEpbm6E7giodE58?g_st=com.google.maps.preview.copy",
  },
  {
    name: "Fuzzy Logic",
    description:
      "Established in 2014, known for balanced beers like Thunderslap IPA & John Lemon.",
    image: "/images/fuzzylogic.png",
    mapUrl: "https://goo.gl/maps/8hEibY9S4oFX1gHb9", // Keep example link or update if you have a real one
  },
  {
    name: "Brew Khnear",
    description:
      "Focused on work/life balance with solid and creative beers using traditional methods.",
    image: "/images/brewkhnear.png",
    mapUrl: "https://goo.gl/maps/ybXN6WmGcDHK4jEZ9", // Example link, replace if you want
  },
  {
    name: "Funghi Art",
    description:
      "Innovating Cambodian rice fermentation into beers, sake, shochu, and gin.",
    image: "/images/funghiart.png",
    mapUrl: "https://maps.app.goo.gl/zJoutcHWooq9VyHt7?g_st=com.google.maps.preview.copy",
  },
  {
    name: "Krama Craft Brewery",
    description:
      "Siem Reap brewery blending Cambodian ingredients with creative brewing.",
    image: "/images/kramacraft.png",
    mapUrl: "https://maps.app.goo.gl/i7d3uRnC9BjYizsp9?g_st=com.google.maps.preview.copy",
  },
  {
    name: "Himawari Microbrewery",
    description:
      "Himawari Microbrewery is the 1st and only microbrewery launched by it's 5-star hotel-apartments in Cambodia.",
    image: "/images/Himawari.png",
    mapUrl: "https://maps.app.goo.gl/e4RNg6DvsJURvnYV7",
  },
  {
    name: "Mozzie's Brewing Co.",
    description:
      "Originally from the USA and now brewing in Phnom Penh, Mozzie's is all about high-quality beer and community.",
    image: "/images/MBC.png",
    mapUrl: "https://goo.gl/maps/mozzies",
  },
  {
    name: "Bash Brewing",
    description:
      "Established in 2016, Bash Brewing is one of the Kingdom's first independent international craft breweries.",
    image: "/images/Bash.png",
    mapUrl: "https://maps.app.goo.gl/pW7ieKD16Zkpzpon6",
  },
];

export default function BreweriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 sm:px-6 py-10">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 text-center mb-10">
          Breweries at the Great Cambodian Craft Beer Festival 2026
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {breweries.map((brewery, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden transition-all duration-300 flex flex-col"
            >
              {/* Margin top above image */}
              {brewery.image && (
                <div className="relative w-full h-36 mt-6">
                  <Image
                    src={brewery.image}
                    alt={brewery.name}
                    fill
                    className="object-contain bg-white"
                  />
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="p-4 flex flex-col flex-grow"
              >
                <h2 className="text-lg font-semibold text-green-700 mb-2">
                  {brewery.name}
                </h2>

                <p className="text-gray-600 mb-4">{brewery.description}</p>

                <a
                  href={brewery.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors self-start"
                >
                  📍 Find Us
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
