type Lead = {
  name: string;
  phone: string;
  car: string;
  location: string;
  mobileLink: string;
};

type LeadCardProps = {
  lead: Lead;
};

export function LeadCard({ lead }: LeadCardProps) {
  return (
    <div className="col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
      <p className="text-sm text-zinc-400">Aktueller Lead</p>
      <h2 className="text-3xl font-bold mt-2">{lead.name}</h2>

      <div className="mt-6 space-y-3 text-lg">
        <p>📞 {lead.phone}</p>
        <p>🚗 {lead.car}</p>
        <p>📍 {lead.location}</p>
      </div>

      <textarea
        placeholder="Notiz zum Gespräch..."
        className="mt-6 w-full h-32 rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-white outline-none"
      ></textarea>

      <div className="mt-6 flex gap-3">
        <a
          href={lead.mobileLink}
          target="_blank"
          className="rounded-xl bg-white text-black px-5 py-3 font-semibold"
        >
          mobile.de öffnen
        </a>

        <a
          href={`tel:${lead.phone}`}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold"
        >
          Anrufen
        </a>
      </div>
    </div>
  );
}