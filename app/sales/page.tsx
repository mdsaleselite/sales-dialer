"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LeadCard } from "../components/LeadCard";
import { supabase } from "../../lib/supabase";
import { Navbar } from "../components/Navbar";

export default function Home() {
  const [leads, setLeads] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [note, setNote] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [showCallbackBox, setShowCallbackBox] = useState(false);
  const [callbackDate, setCallbackDate] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [activeTab, setActiveTab] = useState("alle");
  const [search, setSearch] = useState("");
  const noteRef = useRef<HTMLTextAreaElement | null>(null);
  const searchParams = useSearchParams();
  const leadIdFromUrl = searchParams.get("lead");

  useEffect(() => {
  fetchLeads();

    const interval = setInterval(() => {
      fetchLeads();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.target instanceof HTMLTextAreaElement) return;
    if (event.target instanceof HTMLInputElement) return;

    if (event.key === "1") {
      updateLead("interessiert");
    }

    if (event.key === "2") {
      handleCallbackClick();
    }

    if (event.key === "3") {
      updateLead("kein_interesse");
    }

    if (event.key === "4") {
      updateLead("nicht_erreicht");
    }

    if (event.key.toLowerCase() === "n") {
      goToNextLead();
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
});

  async function fetchLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .neq("status", "archiviert");

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }

    setLeads(data || []);
    if (leadIdFromUrl && data) {
        const index = data.findIndex(
            (lead) => String(lead.ID) === String(leadIdFromUrl)
        );

        if (index !== -1) {
            setCurrentIndex(index);
        }
    }
  }

  async function fetchActivities(leadId: number) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setActivities(data || []);
}

  const filteredLeads = leads.filter((lead) => {
  if (activeTab === "offen") {
    return !lead.status || lead.status === "";
  }

  if (activeTab === "rueckruf") {
    return lead.status === "rueckruf";
  }

  if (activeTab === "interessiert") {
    return lead.status === "interessiert";
  }

  if (activeTab === "nicht_erreicht") {
    return lead.status === "nicht_erreicht";
  }

  return true;
});

const searchedLeads = filteredLeads.filter((lead) => {
  const searchText = search.toLowerCase();

  return (
    lead.name?.toLowerCase().includes(searchText) ||
    lead.phone?.toLowerCase().includes(searchText) ||
    lead.location?.toLowerCase().includes(searchText) ||
    lead.setter?.toLowerCase().includes(searchText) ||
    lead.vehicle_count?.toString().includes(searchText)
  );
});

const now = new Date();

function isCallbackDue(lead: any) {
  if (lead.status !== "rueckruf") return false;

  if (!lead.callback_date || !lead.callback_time) return false;

  const callbackDateTime = new Date(
    `${lead.callback_date}T${lead.callback_time}`
  );

  return callbackDateTime <= now;
}

function isCallbackOverdue(lead: any) {
  if (lead.status !== "rueckruf") return false;

  if (!lead.callback_date || !lead.callback_time) return false;

  const callbackDateTime = new Date(
    `${lead.callback_date}T${lead.callback_time}`
  );

  return callbackDateTime < now;
}

filteredLeads.sort((a, b) => {
  if (a.priority && !b.priority) {
    return -1;
  }

  if (!a.priority && b.priority) {
    return 1;
  }
  const aIsCold = !a.status || a.status === "";
  const bIsCold = !b.status || b.status === "";

  if (aIsCold && !bIsCold) {
  return -1;
  }

  if (!aIsCold && bIsCold) {
  return 1;
  }

  if (isCallbackOverdue(a) && !isCallbackOverdue(b)) {
  return -1;
  }

  if (!isCallbackOverdue(a) && isCallbackOverdue(b)) {
  return 1;
  }

  if (isCallbackDue(a) && !isCallbackDue(b)) {
  return -1;
  }

  if (!isCallbackDue(a) && isCallbackDue(b)) {
  return 1;
  }

  if (a.status === "interessiert" && b.status !== "interessiert") {
    return -1;
  }

  if (a.status !== "interessiert" && b.status === "interessiert") {
    return 1;
  }

  return (a.retry_count || 0) - (b.retry_count || 0);
});

const currentLead = searchedLeads[currentIndex];

useEffect(() => {
  if (currentIndex >= searchedLeads.length) {
    setCurrentIndex(0);
  }
}, [searchedLeads, currentIndex]);

  const today = new Date().toLocaleDateString("en-CA");
  const todayString = new Date().toISOString().split("T")[0];

  const todaysCallbacks = leads.filter(
    (lead) => lead.status === "rueckruf" && String(lead.callback_date) === String(today)
  );

  const overdueCallbacks = leads.filter(
    (lead) =>
      lead.status === "rueckruf" &&
      lead.callback_date &&
      String(lead.callback_date) < String(today)
  );

  const dueCallbacks = leads.filter((lead) => {
    if (lead.status !== "rueckruf") return false;

    if (!lead.callback_date || !lead.callback_time) return false;

    const callbackDateTime = new Date(
      `${lead.callback_date}T${lead.callback_time}`
    );

    return callbackDateTime <= new Date();
  });

  const priorityLeads = leads.filter(
    (lead) => lead.priority
  );

  const callbackLeads = leads.filter(
  (lead) => lead.status === "rueckruf"
  );

  const openLeads = leads.filter((lead) => lead.status !== "kein_interesse");

  const interestedCount = leads.filter(
    (lead) => lead.status === "interessiert"
  ).length;

  const callbackCount = leads.filter(
    (lead) => lead.status === "rueckruf"
  ).length;

  const notReachedCount = leads.filter(
    (lead) => lead.status === "nicht_erreicht"
  ).length;

  const totalWorkedLeads = leads.filter(
    (lead) => lead.status && lead.status !== ""
  ).length;

  const conversionRate =
    totalWorkedLeads > 0
      ? Math.round((interestedCount / totalWorkedLeads) * 100)
      : 0;

  const todaysActivities = activities.filter((activity) =>
    activity.created_at?.startsWith(todayString)
  );

  const todaysCalls = todaysActivities.filter(
    (activity) => activity.type === "status"
  ).length;

  const todaysInterested = todaysActivities.filter(
    (activity) =>
      activity.type === "status" &&
      activity.text.includes("interessiert")
  ).length;

  const todaysConversion =
    todaysCalls > 0
      ? Math.round((todaysInterested / todaysCalls) * 100)
      : 0;

  useEffect(() => {
  if (currentLead) {
    setNote(currentLead.note || "");
    setCallbackDate(currentLead.callback_date || "");
    setCallbackTime(currentLead.callback_time || "");
    fetchActivities(currentLead.ID);
  
    setTimeout(() => {
      noteRef.current?.focus();
    }, 100);
  }
}, [currentLead]);

  useEffect(() => {
  if (!currentLead) return;

  if (note === (currentLead.note || "")) return;

  const timeout = setTimeout(async () => {
    setNoteSaving(true);

    const { error } = await supabase
      .from("leads")
      .update({ note })
      .eq("ID", currentLead.ID);

    if (error) {
      console.error(error);
    }

    setNoteSaving(false);
  }, 800);

  return () => clearTimeout(timeout);
}, [note, currentLead]);

    function goToNextLead() {
        if (searchedLeads.length === 0) {
            setCurrentIndex(0);
            return;
        }

        if (currentIndex < searchedLeads.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    }

  async function updateLead(status: string) {
  if (!currentLead) return;

  const isCallbackLead = currentLead.status === "rueckruf";
  const isNotReached = status === "nicht_erreicht";

  let nextStatus = status;
  let nextCallbackDate = status === "rueckruf" ? callbackDate : null;
  let nextCallbackTime = status === "rueckruf" ? callbackTime : null;
  let nextRetryCount = currentLead.retry_count || 0;

  if (isCallbackLead && isNotReached) {
    nextStatus = "rueckruf";
    nextRetryCount = nextRetryCount + 1;

    const currentDateTime = new Date(
      `${currentLead.callback_date}T${currentLead.callback_time || "09:00"}`
    );

    currentDateTime.setHours(currentDateTime.getHours() + 1);

    nextCallbackDate = currentDateTime.toLocaleDateString("en-CA");
    nextCallbackTime = currentDateTime.toTimeString().slice(0, 5);

    if (nextRetryCount >= 7) {
    nextStatus = "archiviert";
    }
  }


  const { error } = await supabase
    .from("leads")
    .update({
      status: nextStatus,
      note,
      callback_date: nextCallbackDate,
      callback_time: nextCallbackTime,
      retry_count: nextRetryCount,
    })
    .eq("ID", currentLead.ID);

  if (error) {
    alert(error.message);
    console.error(error);
    return;
  }

  const { error: activityError } = await supabase.from("activities").insert([
    {
      lead_id: currentLead.ID,
      type: "status",
      text: `Status geändert zu: ${status}`,
    },
    ...(note
      ? [
          {
            lead_id: currentLead.ID,
            type: "note",
            text: note,
          },
        ]
      : []),
  ]);

  if (activityError) {
    alert(activityError.message);
    console.error(activityError);
    return;
  }

  setShowCallbackBox(false);

  setNote("");

  await fetchActivities(currentLead.ID);

  fetchLeads();
  setCurrentIndex(0);
}

  function handleCallbackClick() {
    setShowCallbackBox(true);
  }

  function saveCallback() {
    if (!callbackDate || !callbackTime) {
      alert("Bitte Rückrufdatum und Uhrzeit eintragen.");
      return;
    }

    updateLead("rueckruf");
  }

  if (!currentLead) {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">

      <p className="text-2xl font-bold">
        Keine Leads in dieser Liste
      </p>

      <button
        onClick={() => {
          setActiveTab("alle");
          setCurrentIndex(0);
        }}
        className="rounded-xl bg-white text-black px-5 py-3 font-semibold"
      >
        Alle Leads anzeigen
      </button>

    </main>
  );
}

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Sales Dialer</h1>
            <p className="text-zinc-400 mt-2">CRM + Dialer + Supabase 🚀
            </p>
          </div>

          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-sm text-zinc-400">Lead</p>
              <p className="text-2xl font-bold">
                {currentIndex + 1} / {leads.length}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-400">Rückrufe heute</p>
              <p className="text-2xl font-bold text-yellow-400">
                {todaysCallbacks.length}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-400">Überfällig</p>
              <p className="text-2xl font-bold text-red-400">
                {overdueCallbacks.length}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-400">Offene Leads</p>
              <p className="text-2xl font-bold text-green-400">
                {openLeads.length}
              </p>
            </div>
          </div>
        </header>
        
        {priorityLeads.length > 0 && (
          <div className="mb-4 rounded-2xl bg-red-950 border border-red-700 p-4 flex items-center justify-between">

            <div>
              <p className="font-bold text-red-300">
                🔥 PRIORITY Leads
              </p>

              <p className="text-sm text-red-200 mt-1">
                {priorityLeads.length} heiße Leads warten
              </p>
            </div>

            <button
              onClick={() => {
                const firstPriorityLead = priorityLeads[0];

                const index = filteredLeads.findIndex(
                  (lead) => lead.ID === firstPriorityLead.ID
                );

                setCurrentIndex(index >= 0 ? index : 0);

                window.scrollTo({
                  top: 500,
                  behavior: "smooth",
                });
              }}
              className="rounded-xl bg-red-600 px-4 py-2 font-semibold"
            >
              Öffnen
            </button>

          </div>
        )}

        {dueCallbacks.length > 0 && (
          <div className="mb-6 rounded-2xl bg-red-950 border border-red-700 p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-red-300">
                ⚠️ Rückrufe warten
              </p>

              <p className="text-sm text-red-200 mt-1">
                {dueCallbacks.length} fällige Rückrufe
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab("rueckruf");

                const firstDueLead = dueCallbacks[0];
                const index = filteredLeads.findIndex(
                  (lead) => lead.ID === firstDueLead.ID
                );

                setCurrentIndex(index >= 0 ? index : 0);

                window.scrollTo({
                  top: 500,
                  behavior: "smooth",
                });
              }}
              className="rounded-xl bg-red-600 px-4 py-2 font-semibold"
            >
              Öffnen
            </button>
          </div>
        )}

        <div className="grid grid-cols-5 gap-3 mb-6">

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
            <p className="text-xs text-zinc-500">Calls heute</p>
            <p className="text-2xl font-bold">
              {todaysCalls}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
            <p className="text-xs text-zinc-500">Interessiert</p>
            <p className="text-2xl font-bold text-green-400">
              {todaysInterested}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
            <p className="text-xs text-zinc-500">Rückrufe</p>
            <p className="text-2xl font-bold text-yellow-400">
              {todaysCallbacks.length}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
            <p className="text-xs text-zinc-500">Nicht erreicht</p>
            <p className="text-2xl font-bold text-zinc-300">
              {notReachedCount}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
            <p className="text-xs text-zinc-500">Conversion</p>
            <p className="text-2xl font-bold text-blue-400">
              {todaysConversion}%
            </p>
          </div>

        </div>

      <div className="flex gap-3 mb-6">

  <button
    onClick={() => {
      setActiveTab("alle");
      setCurrentIndex(0);
    }}

    className={`
      rounded-xl px-4 py-2 font-semibold

      ${
        activeTab === "alle"
          ? "bg-white text-black"
          : "bg-zinc-800 text-white"
      }
    `}
  >
    Alle ({leads.length})
  </button>

  <button
    onClick={() => {
      setActiveTab("offen");
      setCurrentIndex(0);
    }}
    className={`
      rounded-xl px-4 py-2

      ${
        activeTab === "offen"
          ? "bg-white text-black font-semibold"
          : "bg-zinc-800 text-white"
      }
    `}
  >
    Offene ({openLeads.length})
  </button>

  <button
    onClick={() => {
      setActiveTab("rueckruf");
      setCurrentIndex(0);
    }}
    className={`
      rounded-xl px-4 py-2

      ${
        activeTab === "rueckruf"
          ? "bg-yellow-500 text-black font-semibold"
          : "bg-zinc-800 text-white"
      }
    `}
  >
    Rückrufe ({leads.filter((lead) => lead.status === "rueckruf").length})
  </button>

  <button
    onClick={() => {
      setActiveTab("interessiert");
      setCurrentIndex(0);
    }}
    className="rounded-xl bg-green-600 px-4 py-2"
  >
    Interessiert ({leads.filter((lead) => lead.status === "interessiert").length})
  </button>

  <button
    onClick={() => {
      setActiveTab("nicht_erreicht");
      setCurrentIndex(0);
    }}
    className="rounded-xl bg-zinc-700 px-4 py-2"
  >
    Nicht erreicht ({leads.filter((lead) => lead.status === "nicht_erreicht").length})
  </button>

</div>

<div className="mb-6">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Suche nach Name, Telefon, Ort, Setter..."
    className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-4 text-white outline-none"
  />
</div>

{activeTab === "rueckruf" && (
  <div className="mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
    <p className="text-lg font-bold mb-4">Rückruf-Center</p>

    {callbackLeads.length === 0 && (
      <p className="text-zinc-500">Keine Rückrufe geplant.</p>
    )}

    <div className="space-y-3">
      {callbackLeads.map((lead) => (
        <div
          key={lead.ID}
          onClick={() => {
            const index = filteredLeads.findIndex((item) => item.ID === lead.ID);
            if (index !== -1) {
              setCurrentIndex(index);
              window.scrollTo({
                top: 500,
                behavior: "smooth",
              });
            }
          }}
          className={`
            rounded-xl border p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-700

            ${
              String(lead.callback_date) < String(today)
              ? "bg-red-950 border-red-700"
              : String(lead.callback_date) === String(today)
              ? "bg-yellow-950 border-yellow-700"
              : "bg-zinc-800 border-zinc-700"
            }
          `}
        >
          <div>
            <p className="font-bold">{lead.name}</p>
            <p className="text-sm text-zinc-400">
              {lead.callback_date} um {lead.callback_time}
            </p>

            <p className="text-xs mt-1 text-zinc-500">
              {String(lead.callback_date) === String(today)
              ? "Heute"
              : String(lead.callback_date) < String(today)
              ? "Überfällig"
              : "Geplant"}
            </p>
          </div>

          <p className="text-sm text-zinc-400">{lead.phone}</p>
        </div>
      ))}
    </div>
  </div>
)}

        <section className="grid grid-cols-3 gap-6">
          <LeadCard
            lead={{
              name: currentLead.name,
              phone: currentLead.phone,
              car: currentLead.car,
              location: currentLead.location,
              mobileLink: currentLead.mobile_link,
              status: currentLead.status,
              callback_date: currentLead.callback_date,
              callback_time: currentLead.callback_time,
              retry_count: currentLead.retry_count,
              priority: currentLead.priority,
            }}
          />

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Gesprächsnotiz</p>

              {noteSaving && (
                <p className="text-xs text-zinc-500">
                  Speichert...
                </p>
              )}
            </div>

            <textarea
              ref={noteRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Gespräch dokumentieren..."
              className="w-full h-48 rounded-xl bg-zinc-800 border border-zinc-700 p-4 text-white outline-none"
            />

            {showCallbackBox && (
              <div className="mt-4 rounded-xl bg-zinc-800 border border-zinc-700 p-4">
                <p className="font-semibold mb-3">Rückruf planen</p>

                <input
                  type="date"
                  value={callbackDate}
                  onChange={(e) => setCallbackDate(e.target.value)}
                  className="w-full mb-3 rounded-lg bg-zinc-950 border border-zinc-700 p-3 text-white"
                />

                <input
                  type="time"
                  value={callbackTime}
                  onChange={(e) => setCallbackTime(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-700 p-3 text-white"
                />

                <button
                  onClick={saveCallback}
                  className="mt-4 w-full rounded-xl bg-white text-black py-3 font-bold"
                >
                  Rückruf speichern
                </button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={async () => {
                  const newPriority = !currentLead.priority;

                  await supabase
                    .from("leads")
                    .update({
                      priority: newPriority,
                    })
                    .eq("ID", currentLead.ID);

                  await supabase.from("activities").insert([
                    {
                      lead_id: currentLead.ID,
                      type: "priority",
                      text: newPriority
                        ? "🔥 Lead als PRIORITY markiert"
                        : "Priority entfernt",
                    },
                  ]);

                  await fetchActivities(currentLead.ID);
                  fetchLeads();
                }}
                className={`
                  w-full rounded-xl py-3 font-semibold

                  ${
                    currentLead.priority
                      ? "bg-red-700"
                      : "bg-zinc-800"
                  }
                `}
              >
                {currentLead.priority
                  ? "🔥 PRIORITY entfernen"
                  : "🔥 Als PRIORITY markieren"}
              </button>

              <button
                onClick={() => updateLead("interessiert")}
                className="w-full rounded-xl bg-green-600 py-3 font-semibold"
              >
                Interessiert
              </button>

              <button
                onClick={handleCallbackClick}
                className="w-full rounded-xl bg-yellow-600 py-3 font-semibold"
              >
                Rückruf
              </button>

              <button
                onClick={() => updateLead("kein_interesse")}
                className="w-full rounded-xl bg-red-600 py-3 font-semibold"
              >
                Kein Interesse
              </button>

              <button
                onClick={() => updateLead("nicht_erreicht")}
                className="w-full rounded-xl bg-zinc-700 py-3 font-semibold"
              >
                Nicht erreicht
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
  <p className="text-sm text-zinc-400 mb-4">
    Aktivitäten
  </p>

  <div className="space-y-3">

    {activities.length === 0 && (
      <p className="text-zinc-500 text-sm">
        Noch keine Aktivitäten
      </p>
    )}

    {activities.map((activity) => (
      <div
        key={activity.id}
        className="rounded-xl bg-zinc-800 p-4 border border-zinc-700"
      >
        <div className="flex items-center gap-2 mb-2">

  <span className="text-xl">
    {
      activity.type === "status"
      ? activity.text.includes("interessiert")
      ? "🟢"
      : activity.text.includes("rueckruf")
      ? "🟡"
      : activity.text.includes("kein_interesse")
      ? "🔴"
      : activity.text.includes("nicht_erreicht")
      ? "⚫"
      : "📌"
        : activity.type === "note"
        ? "📝"
        : activity.type === "callback"
        ? "📞"
        : "📌"
    }
  </span>

  <p className="font-medium">
    {activity.text}
  </p>

</div>

        <p className="text-xs text-zinc-500 mt-2">
          {new Date(activity.created_at).toLocaleString()}
        </p>
      </div>
    ))}

  </div>
</div>

        </section>
      </div>
    </main>
  );
}