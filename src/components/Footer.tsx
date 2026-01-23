import { Beer, MapPin, Calendar, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-green-100 font-inter text-gray-700 py-10 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand and Description */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Beer className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-800 leading-tight">
                Great Cambodian Craft Beer <br /> Festival 2026
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Join us for Cambodia's premier craft beer festival featuring 14
              exceptional breweries and live entertainment. A celebration of
              local craft culture!
            </p>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                When
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-green-600" />
                <span>January 31, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-green-600" />
                <span>2:00 PM – 12:00 AM</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                Where
              </h4>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                <span>
                  <strong>Coconut Park Koh Pich</strong>
                  <br />
                  Phnom Penh, Cambodia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2026 CBAC — Cambodian Craft Beer Association</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-green-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
