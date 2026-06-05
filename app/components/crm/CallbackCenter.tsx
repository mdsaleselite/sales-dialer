type Lead = {
  ID: number;
  name?: string;
  phone?: string;
  location?: string;
  callback_date?: string;
  callback_time?: string;
  assigned_to?: string;
  status?: string;
};

type Props = {
  leads: Lead[];
  onOpenLead: (leadId: number) => void;
};

export function CallbackCenter({ leads, onOpenLead }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const callbackLeads = leads.filter((lead) => lead.status === "rueckruf");

  const overdue = callbackLeads.filter(
    (lead) => lead.callback_date && String(lead.callback_date) < today
  );

  const todayCallbacks = callbackLeads.filter(
    (lead) => String(lead.callback_date) === today
  );

  const upcoming = callbackLeads.filter(
    (lead) => lead.callback_date && String(lead.callback_date) > today
  );

  function Section({
    title,
    items,
    color,
  }: {
    title: string;
    items: Lead[];
    color: string;
  }) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className={`rounded-xl px-3 py-1 text-sm font-bold ${color}`}>
            {items.length}
          </span>
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-zinc-500">Keine Einträge.</p>
          )}

          {items.map((lead) => (
            <div
              key={lead.ID}
              onClick={() => onOpenLead(lead.ID)}
              className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-800 p-4 hover:border-blue-500"
            >
              <p className="font-bold text-white">{lead.name || "-"}</p>

              <p className="mt-1 text-sm text-zinc-400">
                📞 {lead.phone || "-"}
              </p>

              <p className="text-sm text-zinc-500">
                📍 {lead.location || "-"}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-yellow-400">
                  {lead.callback_date || "-"} {lead.callback_time || ""}
                </span>

                <span className="text-blue-400">
                  {lead.assigned_to || "Nicht übernommen"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      <Section
        title="🔴 Überfällig"
        items={overdue}
        color="bg-red-600 text-white"
      />

      <Section
        title="🟡 Heute"
        items={todayCallbacks}
        color="bg-yellow-500 text-black"
      />

      <Section
        title="🟢 Kommend"
        items={upcoming}
        color="bg-green-600 text-white"
      />
    </div>
  );
}