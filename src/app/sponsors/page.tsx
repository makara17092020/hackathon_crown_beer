import Image from "next/image";

const sponsors = [
  {
    name: "BERTIE",
    description: "Official event partner.",
    logo: "BertiePNH logo-3.png",
  },
  {
    name: "BOTANICO",
    description: "Premium beer supplier.",
    logo: "botanico.png",
  },
  {
    name: "CRAFT BEER ASSOCIATION",
    description: "Local food provider.",
    logo: "CBAC LOGO fa-color.png",
  },
  {
    name: "THAI TAN",
    description: "Community supporter.",
    logo: "Copy of Logo ThaiTan(eng) (1).png",
  },
  {
    name: "YAKIMA CHIEF",
    description: "Craft beer enthusiast group.",
    logo: "Copy of Logo Yakima Chief Hops.png",
  },
  {
    name: "SKAI TECH",
    description: "Event logistics partner.",
    logo: "SKAI_Tech.png",
  },
];

export default function SponsorsPage() {
  // BRAND COLORS FROM LOGO
  // Primary Teal: #00B5B5
  // Secondary Orange: #F08E1E
  // Deep Navy: #1A3C5A

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white px-4 sm:px-6 py-16">
      {/* Primary Teal for the Title */}
      <h1 className="text-4xl sm:text-5xl font-black text-[#00B5B5] mb-6 text-center tracking-tight">
        Our Partners
      </h1>

      <p className="max-w-2xl mx-auto text-center text-[#1A3C5A] font-medium mb-16 text-base sm:text-lg opacity-80">
        We thank our generous sponsors who make the Great Cambodian Craft Beer
        Festival 2026 possible.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
        {sponsors.map(({ name, description, logo }, i) => (
          <div
            key={i}
            className="group bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-8 flex flex-col items-center space-y-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transform hover:-translate-y-3 transition-all duration-500 border border-gray-50 relative overflow-hidden"
          >
            {/* Top accent line (Secondary Orange) */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F08E1E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            {/* Logo Container - Colors always visible now */}
            <div className="w-44 h-44 bg-white flex items-center justify-center overflow-hidden p-4">
              <Image
                src={`/images/${logo}`}
                alt={`${name} Logo`}
                width={170}
                height={170}
                className="object-contain" // Removed grayscale filter
                draggable={false}
              />
            </div>

            <div className="text-center">
              {/* Navy for the Sponsor Name */}
              <h2 className="text-xl font-black text-[#1A3C5A] mb-2 tracking-tight group-hover:text-[#00B5B5] transition-colors">
                {name}
              </h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-20 flex justify-center opacity-20">
        <div className="h-1 w-20 bg-[#F08E1E] rounded-full mx-1" />
        <div className="h-1 w-8 bg-[#00B5B5] rounded-full mx-1" />
        <div className="h-1 w-4 bg-[#1A3C5A] rounded-full mx-1" />
      </div>
    </main>
  );
}
