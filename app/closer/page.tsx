
import { Navbar } from "../components/Navbar";

export default function CloserPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <h1 className="text-4xl font-bold">Closer Workspace</h1>

        <p className="text-zinc-400 mt-2">
          Warme Leads, Termine, Follow-Ups und Abschlüsse.
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

        <div className="mt-10 rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
          <p className="text-zinc-400">
            Noch keine Closing-Pipeline vorhanden.
          </p>
        </div>
      </div>
    </main>
  );
}