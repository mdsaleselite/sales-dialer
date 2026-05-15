export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-bold">
          Sales HQ
        </h1>

        <p className="text-zinc-400 text-xl mt-4">
          CRM • Dialer • Closing • Operations
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6">

          <a
            href="/dashboard"
            className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 hover:border-white transition-all"
          >
            <p className="text-2xl font-bold">
              Dashboard
            </p>

            <p className="text-zinc-400 mt-3">
              KPIs, Priorities und Operations.
            </p>
          </a>

          <a
            href="/sales"
            className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 hover:border-white transition-all"
          >
            <p className="text-2xl font-bold">
              Sales Dialer
            </p>

            <p className="text-zinc-400 mt-3">
              Setter Workspace & Calls.
            </p>
          </a>

          <a
            href="/closer"
            className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 hover:border-white transition-all"
          >
            <p className="text-2xl font-bold">
              Closer
            </p>

            <p className="text-zinc-400 mt-3">
              Warme Leads & Abschlüsse.
            </p>
          </a>

        </div>
      </div>
    </main>
  );
}