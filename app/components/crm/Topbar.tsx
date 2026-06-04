"use client";

type Props = {
  currentUser: string;
  callsToday: number;
  interestedToday: number;
  callbacksToday: number;
};

export function Topbar({
  currentUser,
  callsToday,
  interestedToday,
  callbacksToday,
}: Props) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-zinc-800 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <input
          placeholder="Lead suchen..."
          className="w-80 rounded-xl border border-zinc-300 px-4 py-2 text-black"
        />

        <button className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold">
          + Neuer Lead
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-zinc-500">Calls</p>
          <p className="font-bold text-black">{callsToday}</p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">Interessiert</p>
          <p className="font-bold text-green-600">{interestedToday}</p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">Rückrufe</p>
          <p className="font-bold text-yellow-600">{callbacksToday}</p>
        </div>

        <div className="rounded-xl bg-zinc-100 px-3 py-2 text-black font-semibold">
          {currentUser}
        </div>
      </div>
    </div>
  );
}