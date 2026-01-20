"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Logo1 from "@/images/logo.png";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // check server-side cookie
    async function check() {
      try {
        const res = await fetch("/api/admin/check");
        if (res.ok) router.push("/admin/dashboard");
      } catch (e) {
        // ignore
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
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 py-12 px-4">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={Logo1}
            alt="logo"
            width={48}
            height={48}
            className="rounded-md"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-emerald-700">
              Admin Portal
            </h2>
            <p className="text-sm text-gray-600">
              Secure access to vote results and exports
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 shadow-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 shadow-sm"
                placeholder="Enter admin password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg font-semibold shadow hover:scale-[1.01] transition-transform"
            >
              <span>Sign in</span>
            </button>

            <Link href="/" className="text-sm text-gray-600 hover:underline">
              Back to home
            </Link>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500">
          Note: Credentials are checked server-side. Set{" "}
          <code className="mx-1">ADMIN_USERNAME</code> and{" "}
          <code className="mx-1">ADMIN_PASSWORD</code> in your environment
          (.env) on the server.
        </div>
      </div>
    </div>
  );
}
