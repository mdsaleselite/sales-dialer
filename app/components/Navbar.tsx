export function Navbar() {
  return (
    <div className="mb-8 flex items-center gap-3">

      <a
        href="/"
        className="rounded-xl bg-white text-black px-4 py-2 font-semibold"
      >
        HQ
      </a>

      <a
        href="/dashboard"
        className="rounded-xl bg-zinc-800 px-4 py-2"
      >
        Dashboard
      </a>

      <a
        href="/sales"
        className="rounded-xl bg-zinc-800 px-4 py-2"
      >
        Sales
      </a>

      <a
        href="/closer"
        className="rounded-xl bg-zinc-800 px-4 py-2"
      >
        Closer
      </a>

      <a
        href="/settings"
        className="rounded-xl bg-zinc-800 px-4 py-2"
      >
        Settings
      </a>

    </div>
  );
}