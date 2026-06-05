"use client";

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
  onOpenLead: (leadId: number) => void;
};

const columns = [
  { title: "Neu", status: "" },
  { title: "Nicht erreicht", status: "nicht_erreicht" },
  { title: "Rückruf", status: "rueckruf" },
  { title: "Interessiert", status: "interessiert" },
  { title: "Angebot", status: "angebot" },
  { title: "Gewonnen", status: "gewonnen" },
  { title: "Verloren", status: "kein_interesse" },
];

export function KanbanBoard({ leads, onOpenLead }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-[1600px]">
        {columns.map((column) => {
          const columnLeads = leads.filter((lead) => {
            if (column.status === "") {
              return !lead.status || lead.status === "";
            }

            return lead.status === column.status;
          });

          return (
            <div
              key={column.title}
              className="w-72 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-white">
                  {column.title}
                </h3>

                <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                  {columnLeads.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnLeads.map((lead) => (
                  <div
                    key={lead.ID}
                    onClick={() => onOpenLead(lead.ID)}
                    className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 p-3 hover:border-blue-500"
                  >
                    <p className="font-semibold text-white">
                      {lead.name}
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      {lead.phone}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {lead.location}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        {lead.vehicle_count || "-"} Fzg
                      </span>

                      <span className="text-blue-400">
                        {lead.assigned_to || "Offen"}
                      </span>
                    </div>

                    {lead.callback_date && (
                      <p className="mt-2 text-xs text-yellow-400">
                        📞 {lead.callback_date}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}