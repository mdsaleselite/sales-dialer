"use client";

import Papa from "papaparse";
import { Navbar } from "../components/Navbar";
import { supabase } from "../../lib/supabase";

export default function SettingsPage() {
  async function handleCsvUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
      async complete(results) {
        const rows = results.data as any[];

        console.log(rows[0]);

        const leads = rows.map((row) => ({
            name: row["Unternehmensname"] || "",
            phone: row["Telefon dienstlich"] || row["Mobiltelefon"] || "",
            location: row["Leadliste"] || row["Informationen (Deutschland): Anschrift - stadt"] || "",
            mobile_link: row["Unternehmenswebsite"] || "",
            car: row["Fahrzeuganzahl"] || "",
            vehicle_count: row["Fahrzeuganzahl"] || "",
            setter: row["Setter"] || "",
            note: row["Kommentar"] || "",
            status: "",
            retry_count: 0,
            priority: false,
        }));

        const { data: insertedLeads, error } = await supabase
            .from("leads")
            .insert(leads)
            .select();

        if (error) {
            alert(error.message);
            return;
        }

        const activities = insertedLeads.flatMap((lead, index) => {
            const row = rows[index];

            const items = [];

        if (row["Leadstatus"]) {
            items.push({
                lead_id: lead.ID,
                type: "bitrix",
                text: `Bitrix Status: ${row["Leadstatus"]}`,
            });
        }

        if (row["Letzter Kontakt"]) {
            items.push({
                lead_id: lead.ID,
                type: "bitrix",
                text: `Letzter Kontakt: ${row["Letzter Kontakt"]}`,
            });
        }

        if (row["Kommentar"] && row["Letzter Kontakt"]) {
            const [datePart] = row["Letzter Kontakt"].split(" ");
            const [day, month, year] = datePart.split(".");

            const lastContactDate = new Date(`${year}-${month}-${day}`);
            const fourteenDaysAgo = new Date();

            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

            if (lastContactDate >= fourteenDaysAgo) {
                items.push({
                    lead_id: lead.ID,
                    type: "note",
                    text: `Bitrix Notiz: ${row["Kommentar"]}`,
                });
            }
        }

        return items;
    });

    if (activities.length > 0) {
        await supabase.from("activities").insert(activities);
    }

    alert(`${leads.length} Leads importiert`);
      },
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <h1 className="text-4xl font-bold">Settings</h1>

        <p className="text-zinc-400 mt-2">
          Verwaltung von CRM, Usern, APIs und Automationen.
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="/dashboard"
            className="rounded-xl bg-white text-black px-5 py-3 font-semibold"
          >
            Dashboard
          </a>

          <a
            href="/sales"
            className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold"
          >
            Sales Dialer
          </a>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <p className="font-bold">CSV Import</p>

            <p className="text-sm text-zinc-400 mt-2 mb-4">
              Leadlisten importieren
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="text-sm"
            />
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <p className="font-bold">User Management</p>

            <p className="text-sm text-zinc-400 mt-2">
              Rollen und Zugriffe
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <p className="font-bold">Automationen</p>

            <p className="text-sm text-zinc-400 mt-2">
              Rückrufe & Workflows
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}