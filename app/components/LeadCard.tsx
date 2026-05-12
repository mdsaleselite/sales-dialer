type Lead = {
  name: string;
  phone: string;
  car: string;
  location: string;
  mobileLink: string;

  status?: string;
  callback_date?: string;
  callback_time?: string;
  retry_count?: number;
};

type LeadCardProps = {
  lead: Lead;
};

export function LeadCard({ lead }: LeadCardProps) {
  const now = new Date();

  const callbackDateTime =
    lead.callback_date && lead.callback_time
      ? new Date(`${lead.callback_date}T${lead.callback_time}`)
      : null;

  const isOverdue =
    lead.status === "rueckruf" &&
    callbackDateTime &&
    callbackDateTime < now;

  const isDue =
    lead.status === "rueckruf" &&
    callbackDateTime &&
    callbackDateTime <= now;

  const isCold =
    !lead.status || lead.status === "";

  return (
    <div
        className={`
            col-span-2 rounded-2xl border p-6 transition-all

            ${
                isOverdue
                    ? "bg-red-950 border-red-700 shadow-[0_0_40px_rgba(255,0,0,0.25)]"
                    :isDue
                    ? "bg-yellow-950 border-yellow-700 shadow-[0_0_40px_rgba(255,200,0,0.2)]"
                    : isCold
                    ? "bg-blue-950 border-blue-700 shadow-[0_0_30px_rgba(0,100,255,0.15)]"
                    : "bg-zinc-900 border-zinc-800"
            }
        `}
    >
      <p className="text-sm text-zinc-400">Aktueller Lead</p>

      <h2 className="text-3xl font-bold mt-2">
        {lead.name}
      </h2>

      <div className="mt-3">

        <p
          className={`
            text-sm mt-2 font-medium

            ${
              (lead.retry_count || 0) >= 4
                ? "text-red-400"
                : (lead.retry_count || 0) >= 2
                ? "text-yellow-400"
                : "text-zinc-400"
            }
          `}
        >
          Retry: {lead.retry_count || 0}
        </p>

        <span
          className={`
            px-3 py-1 rounded-full text-sm font-semibold

            ${
              lead.status === "interessiert"
                ? "bg-green-600"
                : lead.status === "rueckruf"
                ? "bg-yellow-600"
                : lead.status === "kein_interesse"
                ? "bg-red-600"
                : lead.status === "nicht_erreicht"
                ? "bg-zinc-600"
                : "bg-blue-600"
            }
          `}
        >
          {lead.status || "offen"}
        </span>

      </div>

      <div className="mt-6 space-y-3 text-lg">
        <p>📞 {lead.phone}</p>
        <p>🚗 {lead.car}</p>
        <p>📍 {lead.location}</p>
      </div>

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