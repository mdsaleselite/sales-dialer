"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  note?: string;
  due_date?: string;
  due_time?: string;
  assigned_to?: string;
  completed?: boolean;
};

type Props = {
  tasks: Task[];
  onCreateTask: (task: {
    title: string;
    note: string;
    due_date: string;
    due_time: string;
  }) => void;
};

export function TaskPanel({ tasks, onCreateTask }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const openTasks = tasks.filter((t) => !t.completed);

  function saveTask() {
    if (!title) {
      alert("Bitte Titel eingeben.");
      return;
    }

    onCreateTask({
      title,
      note,
      due_date: dueDate,
      due_time: dueTime,
    });

    setTitle("");
    setNote("");
    setDueDate("");
    setDueTime("");
    setShowForm(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Aufgaben</h2>
          <p className="text-sm text-zinc-400">
            Heute, überfällig und kommende Aufgaben
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          + Neue Aufgabe
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-800 p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Aufgabentitel"
            className="mb-3 w-full rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-white outline-none"
          />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notiz"
            className="mb-3 w-full rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-white outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-white outline-none"
            />

            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-white outline-none"
            />
          </div>

          <button
            onClick={saveTask}
            className="mt-4 w-full rounded-xl bg-white py-3 font-bold text-black"
          >
            Aufgabe speichern
          </button>
        </div>
      )}

      <div className="space-y-3">
        {openTasks.length === 0 && (
          <p className="text-zinc-500">Keine offenen Aufgaben.</p>
        )}

        {openTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-zinc-800 bg-zinc-800 p-4"
          >
            <p className="font-semibold text-white">{task.title}</p>

            {task.note && (
              <p className="mt-1 text-sm text-zinc-400">{task.note}</p>
            )}

            <p className="mt-2 text-xs text-zinc-500">
              {task.due_date || "-"} {task.due_time || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}