import { Crown, Users, Beer, Medal } from "lucide-react";

export default function AwardsPage() {
  // BRAND COLORS
  // Primary Teal: #00B5B5
  // Secondary Orange: #F08E1E
  // Deep Navy: #1A3C5A

  const awards = [
    {
      title: "Main Award",
      subtitle: "Professional Judging",
      description:
        "This award is judged by a group of six international experts, according to the BJCP score sheet in a blind tasting mode. Some of the judges are BJCP certified.",
      icon: <Crown size={48} className="text-[#00B5B5]" />,
      medals: [
        { label: "Gold", color: "text-[#F08E1E]" }, // Gold/Orange accent
        { label: "Silver", color: "text-gray-400" },
        { label: "Bronze", color: "text-[#B87333]" },
      ],
    },
    {
      title: "People's Choice",
      subtitle: "Guest Voting",
      description:
        "This is the award judged by you – all our guests. To judge, please use the judging form on this website and submit one judging per beer.",
      icon: <Users size={48} className="text-[#00B5B5]" />,
    },
    {
      title: "Brewer's Choice",
      subtitle: "Peer Recognition",
      description:
        "All brewers participating are also present at the event. The brewers judge their fellow competitors' creations in a show of mutual respect.",
      icon: <Beer size={48} className="text-[#00B5B5]" />,
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#F8F9FA]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-[#1A3C5A] tracking-tight">
          Competition <span className="text-[#00B5B5]">Awards</span>
        </h2>
        <div className="w-24 h-1.5 bg-[#F08E1E] mx-auto mt-4 rounded-full" />
        <p className="text-[#1A3C5A]/70 mt-6 text-lg font-medium max-w-2xl mx-auto">
          Three prestigious categories honoring the craftsmanship and culture of
          Cambodian brewing.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        {awards.map((award, index) => (
          <div
            key={index}
            className="group bg-white rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,181,181,0.1)] border border-gray-100 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="mb-6 p-4 bg-[#E0F7F8] rounded-3xl group-hover:scale-110 transition-transform duration-500">
              {award.icon}
            </div>

            <h3 className="text-2xl font-black text-[#1A3C5A] mb-2">
              {award.title}
            </h3>

            <p className="mb-6 inline-block bg-[#FFF4E5] text-[#F08E1E] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              {award.subtitle}
            </p>

            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {award.description}
            </p>

            {award.medals && (
              <div className="flex space-x-8 mt-8 pt-8 border-t border-gray-50 w-full justify-center">
                {award.medals.map((medal, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-[10px] font-black uppercase tracking-tighter text-gray-400"
                  >
                    <Medal size={24} className={`${medal.color} mb-1`} />
                    <span>{medal.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-[#1A3C5A] font-bold text-sm italic">
          Judging conducted in accordance with international blind-tasting
          standards.
        </p>
      </div>
    </section>
  );
}
