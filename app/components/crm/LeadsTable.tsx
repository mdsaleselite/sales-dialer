type Lead = {
  ID: number;
  name?: string;
  phone?: string;
  location?: string;
  vehicle_count?: string | number;
  status?: string;
  assigned_to?: string;
  callback_date?: string;
  callback_time?: string;
};

type Props = {
  leads: Lead[];
  onSelectLead: (leadId: number) => void;
};

export function LeadsTable({ leads, onSelectLead }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xl font-bold text-white">Leads</p>
        <p className="text-sm text-zinc-400">{leads.length} Einträge</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-400">
            <tr className="border-b border-zinc-800">
              <th className="py-3">Firma</th>
              <th className="py-3">Telefon</th>
              <th className="py-3">Ort/Liste</th>
              <th className="py-3">Fahrzeuge</th>
              <th className="py-3">Status</th>
              <th className="py-3">Setter</th>
              <th className="py-3">Rückruf</th>
              <th className="py-3">Aktion</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.ID}
                className="border-b border-zinc-800 hover:bg-zinc-800"
              >
                <td className="py-3 font-semibold text-white">
                  {lead.name || "-"}
                </td>

                <td className="py-3 text-zinc-300">
                  {lead.phone || "-"}
                </td>

                <td className="py-3 text-zinc-300">
                  {lead.location || "-"}
                </td>

                <td className="py-3 text-zinc-300">
                  {lead.vehicle_count || "-"}
                </td>

                <td className="py-3">
                  <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs text-white">
                    {lead.status || "offen"}
                  </span>
                </td>

                <td className="py-3 text-zinc-300">
                  {lead.assigned_to || "Nicht übernommen"}
                </td>

                <td className="py-3 text-zinc-300">
                  {lead.callback_date
                    ? `${lead.callback_date} ${lead.callback_time || ""}`
                    : "-"}
                </td>

                <td className="py-3">
                  <button
                    onClick={() => onSelectLead(lead.ID)}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Öffnen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}