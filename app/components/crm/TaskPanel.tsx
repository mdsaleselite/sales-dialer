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
  onCompleteTask: (taskId: number) => void;
};

export function TaskPanel({ tasks, onCreateTask, onCompleteTask }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const openTasks = tasks.filter((task) => !task.completed);

  const overdueTasks = openTasks.filter(
    (task) => task.due_date && task.due_date < today
  );

  const todayTasks = openTasks.filter(
    (task) => task.due_date === today
  );

  const upcomingTasks = openTasks.filter(
    (task) => task.due_date && task.due_date > today
  );

  const noDateTasks = openTasks.filter(
    (task) => !task.due_date
  );

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

  function TaskCard({ task }: { task: Task }) {
    return (
      <div
        className={`
          rounded-xl border p-4

          ${
            task.due_date && task.due_date < today
              ? "bg-red-950 border-red-700"
              : task.due_date === today
              ? "bg-yellow-950 border-yellow-700"
              : "bg-zinc-800 border-zinc-700"
          }
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-white">{task.title}</p>

            {task.note && (
              <p className="mt-1 text-sm text-zinc-400">{task.note}</p>
            )}

            <p className="mt-2 text-xs text-zinc-500">
              {task.due_date || "Kein Datum"} {task.due_time || ""}
            </p>

            {task.assigned_to && (
              <p className="mt-1 text-xs text-blue-400">
                👤 {task.assigned_to}
              </p>
            )}
          </div>

          <button
            onClick={() => onCompleteTask(task.id)}
            className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-black"
          >
            Erledigt
          </button>
        </div>
      </div>
    );
  }

  function Section({
    title,
    items,
  }: {
    title: string;
    items: Task[];
  }) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>

          <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
            {items.length}
          </span>
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-zinc-500">Keine Aufgaben.</p>
          )}

          {items.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Aufgaben</h2>
          <p className="text-sm text-zinc-400">
            Heute, überfällig, kommend und offene To-dos.
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
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
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

      <div className="grid grid-cols-4 gap-5">
        <Section title="🔴 Überfällig" items={overdueTasks} />
        <Section title="🟡 Heute" items={todayTasks} />
        <Section title="🟢 Kommend" items={upcomingTasks} />
        <Section title="⚪ Ohne Datum" items={noDateTasks} />
      </div>
    </div>
  );
}