"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Sales Dialer", href: "/sales" },
    { name: "Leads", href: "/sales?view=leads" },
    { name: "Rückrufe", href: "/sales?view=callbacks" },
    { name: "Aufgaben", href: "/sales?view=tasks" },
    { name: "Pipeline", href: "/sales?view=pipeline" },
    { name: "Einstellungen", href: "/settings" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-5">
      <h1 className="text-2xl font-bold text-white mb-8">
        Sales HQ
      </h1>

      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              block rounded-xl px-4 py-3 transition

              ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}