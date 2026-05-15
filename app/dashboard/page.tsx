"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Navbar } from "../components/Navbar";

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .neq("status", "archiviert");

    if (error) {
      console.error(error);
      return;
    }

    setLeads(data || []);
  }

  const today = new Date().toLocaleDateString("en-CA");

  const callbacksOpen = leads.filter((lead) => lead.status === "rueckruf").length;
  const priorityCount = leads.filter((lead) => lead.priority).length;
  const interestedCount = leads.filter((lead) => lead.status === "interessiert").length;

  const workedCount = leads.filter(
    (lead) => lead.status && lead.status !== ""
  ).length;

  const conversion =
    workedCount > 0 ? Math.round((interestedCount / workedCount) * 100) : 0;

  const todaysCallbacks = leads.filter(
    (lead) =>
      lead.status === "rueckruf" &&
      String(lead.callback_date) === String(today)
  ).length;

  const dueCallbacks = leads.filter((lead) => {
    if (lead.status !== "rueckruf") return false;
    if (!lead.callback_date || !lead.callback_time) return false;

    const callbackDateTime = new Date(
      `${lead.callback_date}T${lead.callback_time}`
    );

    return callbackDateTime <= new Date();
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="text-zinc-400 mt-2">
          Überblick über Calls, Rückrufe, Priorities und Performance.
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="/sales"
            className="rounded-xl bg-white text-black px-5 py-3 font-semibold"
          >
            Sales Dialer öffnen
          </a>

          <a
            href="/closer"
            className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold"
          >
            Closer
          </a>

          <a
            href="/settings"
            className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold"
          >
            Settings
          </a>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-sm text-zinc-400">Leads aktiv</p>
            <p className="text-3xl font-bold mt-2">{leads.length}</p>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-sm text-zinc-400">Rückrufe offen</p>
            <p className="text-3xl font-bold mt-2 text-yellow-400">
              {callbacksOpen}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-sm text-zinc-400">Priority Leads</p>
            <p className="text-3xl font-bold mt-2 text-red-400">
              {priorityCount}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-sm text-zinc-400">Conversion</p>
            <p className="text-3xl font-bold mt-2 text-blue-400">
              {conversion}%
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <p className="text-sm text-zinc-400">Rückrufe heute</p>
          <p className="text-3xl font-bold mt-2 text-yellow-400">
            {todaysCallbacks}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <p className="text-xl font-bold mb-4">🔥 Priority Leads</p>

            <div className="space-y-3">
              {leads
                .filter((lead) => lead.priority)
                .slice(0, 5)
                .map((lead) => (
                  <a
                    key={lead.ID}
                    href={`/sales?lead=${lead.ID}`}
                    className="block rounded-xl bg-zinc-800 p-4 hover:bg-zinc-700 transition-all"
                  >
                    <p className="font-bold">{lead.name}</p>
                    <p className="text-sm text-zinc-400 mt-1">{lead.phone}</p>
                  </a>
                ))}
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <p className="text-xl font-bold mb-4">⚠️ Fällige Rückrufe</p>

            <div className="space-y-3">
              {dueCallbacks.slice(0, 5).map((lead) => (
                <a
                  key={lead.ID}
                  href={`/sales?lead=${lead.ID}`}
                  className="block rounded-xl bg-zinc-800 p-4 hover:bg-zinc-700 transition-all"
                >
                  <p className="font-bold">{lead.name}</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    {lead.callback_date} um {lead.callback_time}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}