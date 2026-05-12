"use client";

import { useState } from "react";
import { LeadCard } from "./components/LeadCard";

const leads = [
  {
    name: "Max Mustermann",
    phone: "0176 12345678",
    car: "BMW 320d Touring",
    location: "Frankfurt am Main",
    mobileLink: "https://www.mobile.de",
  },
  {
    name: "Autohaus Müller",
    phone: "069 987654",
    car: "Mercedes C220 CDI",
    location: "Offenbach",
    mobileLink: "https://www.mobile.de",
  },
  {
    name: "Ali Yilmaz",
    phone: "0157 55555555",
    car: "Audi A4 Avant",
    location: "Hanau",
    mobileLink: "https://www.mobile.de",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentLead = leads[currentIndex];

  function goToNextLead() {
    if (currentIndex < leads.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Sales Dialer</h1>
            <p className="text-zinc-400 mt-2">
              Schneller durchtelefonieren. Weniger Klicks. Mehr Abschlüsse.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-zinc-400">Lead</p>
            <p className="text-2xl font-bold">
              {currentIndex + 1} / {leads.length}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-6">
          <LeadCard lead={currentLead} />

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <p className="text-sm text-zinc-400 mb-4">Aktion</p>

            <div className="space-y-3">
              <button
                onClick={goToNextLead}
                className="w-full rounded-xl bg-green-600 py-3 font-semibold"
              >
                Interessiert
              </button>

              <button
                onClick={goToNextLead}
                className="w-full rounded-xl bg-yellow-600 py-3 font-semibold"
              >
                Rückruf
              </button>

              <button
                onClick={goToNextLead}
                className="w-full rounded-xl bg-red-600 py-3 font-semibold"
              >
                Kein Interesse
              </button>

              <button
                onClick={goToNextLead}
                className="w-full rounded-xl bg-zinc-700 py-3 font-semibold"
              >
                Nicht erreicht
              </button>

              <button
                onClick={goToNextLead}
                className="w-full rounded-xl bg-white text-black py-3 font-bold mt-6"
              >
                Nächster Lead
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}