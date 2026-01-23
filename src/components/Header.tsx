"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Linkedin,
  Github,
  Globe,
  Home as HomeIcon,
  Beer,
  Calendar,
  Award,
  Vote,
  User,
} from "lucide-react";

import BeerFestival from "@/images/BeerFestival.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Breweries", href: "/breweries", icon: Beer },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Awards", href: "/awards", icon: Award },
    { name: "Sponsor", href: "/sponsors", icon: Globe },
    { name: "Admin", href: "/admin/login", icon: User },
  ];

  const voteFormUrl = "https://forms.gle/LPZFNjGQymjVju8B8";

  return (
    <header className="sticky top-0 z-50 bg-[#F8F9FA] font-inter text-[#212529] shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Mobile menu button on left */}
        <button
          className="md:hidden p-2 rounded bg-[#40916C] hover:bg-[#1B4332] text-white transition w-10 h-10 flex items-center justify-center"
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
          type="button"
        >
          <Menu size={24} />
        </button>

        {/* Desktop logo on left */}
        <div className="hidden md:flex items-center">
          <Link
            href="/"
            className="flex items-center group transition-transform hover:scale-105"
          >
            <Image
              src={BeerFestival}
              alt="Great Cambodian Craft Beer Festival"
              width={180}
              height={60}
              priority
              className="w-auto h-12 md:h-14"
            />
          </Link>
        </div>

        {/* Desktop navigation menu */}
        <nav className="hidden md:flex space-x-6 text-md font-medium">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-2 relative group transition ${
                  isActive ? "text-green-700" : "text-[#1B4332]"
                }`}
              >
                <Icon
                  size={18}
                  className={`${
                    isActive ? "text-green-700" : "text-[#1B4332]"
                  } group-hover:text-[#40916C] transition duration-200`}
                />
                <span
                  className={`${
                    isActive
                      ? "text-green-700 font-semibold"
                      : "group-hover:text-[#40916C]"
                  } transition duration-200
                  after:content-[''] after:absolute after:w-0 after:h-[2px]
                  after:bg-[#FFD166] after:left-0 after:bottom-[-4px]
                  group-hover:after:w-full after:transition-all after:duration-300`}
                >
                  {name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Vote button */}
        <a
          href={voteFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center space-x-2 font-semibold px-5 py-2.5 rounded-full shadow-md transition-all duration-300 ease-out transform hover:scale-105
            bg-yellow-600 text-white hover:shadow-lg"
        >
          <Vote size={18} />
          <span>Vote</span>
        </a>

        {/* Mobile logo on right */}
        <div className="flex md:hidden items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={BeerFestival}
              alt="Great Cambodian Craft Beer Festival"
              width={120}
              height={40}
              className="w-auto h-10"
              priority
            />
          </Link>
        </div>

        {/* Mobile menu overlay and drawer */}
        <div
          className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeMenu}
        >
          {/* Drawer Sidebar */}
          <div
            className={`absolute left-0 top-0 h-full w-72 text-[#1B4332] bg-white rounded-r-xl shadow-lg transform transition-transform duration-300 flex flex-col ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header in sidebar */}
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-bold text-lg">Menu</span>
              <button
                onClick={closeMenu}
                className="p-2 rounded hover:bg-gray-100 text-[#1B4332] transition"
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Nav Area */}
            <nav className="flex-1 mt-4 flex flex-col space-y-2 px-4 overflow-y-auto">
              {navItems.map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={name}
                    href={href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? "text-green-700" : "text-gray-500"}
                    />
                    <span>{name}</span>
                  </Link>
                );
              })}

              <hr className="my-4 border-gray-100" />

              {/* Mobile Vote button */}
              <a
                href={voteFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex items-center justify-center space-x-3 px-4 py-3 rounded-full bg-yellow-600 text-white font-semibold shadow-md active:scale-95 transition-transform"
              >
                <Vote size={20} />
                <span>Vote Now</span>
              </a>
            </nav>

            {/* Social icons at bottom of sidebar */}
            <div className="mt-auto flex justify-center space-x-8 p-8 border-t bg-gray-50 rounded-br-xl">
              {[Linkedin, Github, Globe].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-gray-500 hover:text-[#40916C] transition duration-200"
                >
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
