"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// Using the logo path confirmed in your file explorer
import BeerFestival from "@/images/BeerFestival.png";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  // BRAND COLORS
  // Primary (Teal): #00B5B5
  // Secondary (Orange): #F08E1E
  // Dark (Navy): #1A3C5A

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/admin/check");
        if (res.ok) router.push("/admin/dashboard");
      } catch (_err) {
        /* ignore */
      }
    }
    check();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data?.message || "Invalid credentials");
      }
    } catch (_err) {
      setError("Network error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 animate-slideUp">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-2 bg-[#E0F7F8] rounded-2xl">
            <Image
              src={BeerFestival}
              alt="Festival Logo"
              width={50}
              height={50}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="h-10 w-[1px] bg-gray-200 mx-1"></div>
          <div>
            {/* Navy Blue Text */}
            <h2 className="text-2xl font-black text-[#1A3C5A] tracking-tight">
              Admin Portal
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Secure Festival Management
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              name="admin-user-field"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl 
              focus:outline-none focus:ring-2 focus:ring-[#00B5B5]/20 focus:bg-white focus:border-[#00B5B5] 
              transition-all text-[#1A3C5A] font-medium"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                name="admin-pass-field"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl 
                focus:outline-none focus:ring-2 focus:ring-[#00B5B5]/20 focus:bg-white focus:border-[#00B5B5] 
                transition-all text-[#1A3C5A] font-medium"
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00B5B5] transition-colors"
              >
                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl border border-red-100 animate-fadeIn">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            {/* Primary Button (Teal) */}
            <button
              type="submit"
              className="flex-1 bg-[#00B5B5] hover:bg-[#009999] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#00B5B5]/20 transition-all active:scale-95"
            >
              Sign in
            </button>

            {/* Back Button (Hover Secondary Orange) */}
            <Link
              href="/"
              className="text-sm font-bold text-gray-400 hover:text-[#F08E1E] transition-colors px-2"
            >
              Back
            </Link>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            © 2026 Great Cambodian Craft Beer Festival
          </p>
        </div>
      </div>
    </div>
  );
}
