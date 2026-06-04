"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email || !password) {
      alert("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/sales");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-8">
        <h1 className="text-4xl font-bold">Sales HQ</h1>

        <p className="text-zinc-400 mt-2">
          Einloggen und Pipeline starten.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4 text-white outline-none"
          />

          <button
            onClick={login}
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-4 font-bold"
          >
            {loading ? "Login..." : "Einloggen"}
          </button>
        </div>
      </div>
    </main>
  );
}