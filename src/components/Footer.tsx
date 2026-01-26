import { Beer as BeerIcon, MapPin, Calendar, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#00B5B5]/8 text-[#1A3C5A] py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Left: brand + short blurb */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <BeerIcon className="w-7 h-7 text-[#00B5B5] flex-shrink-0" />
              <h3 className="text-lg font-bold text-[#1A3C5A] leading-tight">
                Great Cambodian Craft Beer
              </h3>
            </div>
            <p className="text-sm text-[#1A3C5A]/80 leading-relaxed max-w-md">
              Cambodia's premier craft beer festival — local breweries, live
              music, and community celebration. See you at Coconut Park Koh Pich.
            </p>
          </div>

          {/* Right: details + links */}
          <div className="flex-shrink-0 w-full md:w-64">
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#1A3C5A] mb-2">
                Event
              </h4>
              <div className="text-sm text-[#1A3C5A]/90 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#00B5B5]" />
                  <span>January 31, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00B5B5]" />
                  <span>2:00 PM – 12:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00B5B5]" />
                  <span>Coconut Park Koh Pich, Phnom Penh</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-[#1A3C5A]/70">© 2026 CBAC</p>
              <div className="flex gap-4">
                <a href="#" className="text-xs text-[#1A3C5A]/70 hover:text-[#00B5B5] transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-xs text-[#1A3C5A]/70 hover:text-[#00B5B5] transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
