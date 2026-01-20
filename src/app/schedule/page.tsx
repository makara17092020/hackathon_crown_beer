"use client";

import React from "react";
import { Music, Clock, Award, Calendar, Users } from "lucide-react";

const items = [
  { time: "2:00 PM", title: "DJ Cory - Event begins", icon: Music },
  { time: "2:45 PM to 3:30 PM", title: "Cambodia Sound Base - Live Performance", icon: Music },
  { time: "4:00 PM to 4:45 PM", title: "Zak Zoot - Live Performance", icon: Music },
  { time: "5:15 PM to 6:00 PM", title: "Ms Sarawan - Live Performance", icon: Music },
  { time: "6:30 PM to 7:30 PM", title: "Bustaka Band - Live Performance", icon: Music },
  { time: "8:00 PM to 9:00 PM", title: "Checkered Past / Brass - Live Performance", icon: Music },
  { time: "9:05 PM", title: "Yakima Chief Hops 'Festival's favorite' Award", icon: Award },
  { time: "9:30 PM to 10:30 PM", title: "Kampot Play Boys - Live Performance", icon: Music },
  { time: "10:30 PM", title: "DJ Cory continues", icon: Music },
  { time: "11:30 PM", title: "DJ Cory - Event ends", icon: Clock },
];

export default function EventTimeLine() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-green-500 mb-8">
        Event Schedule
      </h1>
      <section className="max-w-3xl mx-auto p-6 sm:p-8">
        <ol className="relative border-l-2 border-l-green-400">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={item.time + idx} className="mb-8 ml-6 last:mb-0">
                {/* Circle with icon */}
                <span className="absolute -left-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-400 ring-4 ring-white text-white shadow-md">
                  <Icon className="h-6 w-6" />
                </span>

                {/* Card */}
                <div className="rounded-md border border-green-200 bg-green-50 p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 ml-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="text-gray-900 font-semibold text-lg tracking-wide mb-1 sm:mb-0">
                      {item.title}
                    </h3>
                    <time className="text-green-700 font-mono text-sm font-medium self-end sm:self-center">
                      {item.time}
                    </time>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
