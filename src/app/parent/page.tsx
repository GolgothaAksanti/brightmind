"use client";

import { useState } from "react";
import { Button, KindBadge, Meter, PageHeader, Panel, Stat } from "@/components/ui";
import {
  allSkills,
  dayKey,
  lastDays,
  levelInfo,
  minutesOn,
  readingSpeed,
  recommendation,
  streak,
  totalXp,
} from "@/lib/skills";
import { deleteProfile, exportData, setPin, updateProfile, useStore } from "@/lib/store";
import { KIND_META, type Profile } from "@/lib/types";

const TONES = { reading: "grape", writing: "coral", focus: "mint", problem: "sun" } as const;

export default function ParentPage() {
  const { state, ready } = useStore();
  const [unlocked, setUnlocked] = useState(false);

  if (!ready) return <div className="h-96" aria-hidden />;

  return (
    <>
      <PageHeader
        title="Parent area"
        intro="See how each child is progressing, set a daily goal and manage players."
      />
      {state.pin === null ? (
        <CreatePin onDone={() => setUnlocked(true)} />
      ) : !unlocked ? (
        <EnterPin pin={state.pin} onDone={() => setUnlocked(true)} />
      ) : (
        <Dashboard onLock={() => setUnlocked(false)} />
      )}
    </>
  );
}

function CreatePin({ onDone }: { onDone: () => void }) {
  const [pin, setPinValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const ok = /^\d{4}$/.test(pin) && pin === confirm;

  return (
    <Panel tone="sun-tint" className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ok) return;
          setPin(pin);
          onDone();
        }}
      >
        <h2 className="text-2xl font-black">Set a parent PIN</h2>
        <p className="mt-1 font-semibold text-ink-soft">
          A 4-digit PIN keeps this area separate from the children. It is a simple lock, not strong security, and it
          is stored on this device.
        </p>
        <label className="mt-4 block">
          <span className="font-extrabold">New PIN</span>
          <input
            inputMode="numeric"
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
            className="mt-1 w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-2xl font-black tracking-[0.5em]"
          />
        </label>
        <label className="mt-4 block">
          <span className="font-extrabold">Repeat PIN</span>
          <input
            inputMode="numeric"
            type="password"
            maxLength={4}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
            className="mt-1 w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-2xl font-black tracking-[0.5em]"
          />
        </label>
        <div className="mt-5">
          <Button type="submit" tone="ink" disabled={!ok}>
            Save PIN and continue
          </Button>
        </div>
      </form>
    </Panel>
  );
}

function EnterPin({ pin, onDone }: { pin: string; onDone: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  return (
    <Panel tone="sun-tint" className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value === pin) onDone();
          else {
            setError(true);
            setValue("");
          }
        }}
      >
        <h2 className="text-2xl font-black">Enter your PIN</h2>
        <label className="mt-4 block">
          <span className="font-extrabold">4-digit PIN</span>
          <input
            inputMode="numeric"
            type="password"
            maxLength={4}
            autoFocus
            value={value}
            onChange={(e) => {
              setError(false);
              setValue(e.target.value.replace(/\D/g, ""));
            }}
            aria-invalid={error}
            aria-describedby={error ? "pin-error" : undefined}
            className="mt-1 w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-2xl font-black tracking-[0.5em]"
          />
        </label>
        {error && (
          <p id="pin-error" role="alert" className="mt-2 font-extrabold text-coral">
            That PIN is not right. Try again.
          </p>
        )}
        <div className="mt-5">
          <Button type="submit" tone="ink" disabled={value.length !== 4}>
            Unlock
          </Button>
        </div>
      </form>
    </Panel>
  );
}

function Dashboard({ onLock }: { onLock: () => void }) {
  const { state } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const profile = state.profiles.find((p) => p.id === (selected ?? state.profiles[0]?.id)) ?? null;

  if (!profile) {
    return (
      <Panel className="max-w-xl">
        <h2 className="text-2xl font-black">No players yet</h2>
        <p className="mt-1 font-semibold text-ink-soft">Create a player from the Add a player link to see progress here.</p>
        <div className="mt-4">
          <Button tone="white" onClick={onLock}>
            Lock
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Players" className="flex flex-wrap gap-2">
          {state.profiles.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={p.id === profile.id}
              onClick={() => setSelected(p.id)}
              className={`rounded-full border-2 border-ink px-4 py-2 font-extrabold ${
                p.id === profile.id ? "bg-ink text-white" : "bg-white hover:bg-paper-deep"
              }`}
            >
              <span aria-hidden>{p.avatar}</span> {p.name}
            </button>
          ))}
        </div>
        <Button tone="white" onClick={onLock} className="ml-auto !py-2">
          Lock
        </Button>
      </div>

      <Overview profile={profile} />
      <Settings profile={profile} onDeleted={() => setSelected(null)} />
    </div>
  );
}

function Overview({ profile }: { profile: Profile }) {
  const acts = profile.activities;
  const info = levelInfo(totalXp(profile));
  const skills = allSkills(acts);
  const week = lastDays(7).map((d) => ({ ...d, minutes: minutesOn(acts, d.key) }));
  const maxMin = Math.max(profile.dailyGoalMin, ...week.map((d) => d.minutes), 1);
  const weekTotal = week.reduce((n, d) => n + d.minutes, 0);
  const activeDays = week.filter((d) => d.minutes > 0).length;
  const wpm = readingSpeed(acts);
  const rec = recommendation(acts);
  const recent = [...acts].reverse().slice(0, 10);

  return (
    <>
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Summary">
        <Stat value={`Level ${info.level}`} label={`${totalXp(profile)} XP`} />
        <Stat value={`${streak(acts)} days`} label="Current streak" />
        <Stat value={`${weekTotal} min`} label={`This week, ${activeDays} active day${activeDays === 1 ? "" : "s"}`} />
        <Stat value={wpm ? `${wpm} wpm` : "—"} label="Reading speed" />
      </section>

      <section aria-labelledby="week">
        <h2 id="week" className="mb-3 text-2xl font-black">
          Practice this week
        </h2>
        <Panel>
          <div className="flex h-44 items-end gap-3" role="img" aria-label={`Minutes practised per day: ${week.map((d) => `${d.label} ${d.minutes}`).join(", ")}`}>
            {week.map((d) => (
              <div key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-sm font-extrabold">{d.minutes || ""}</span>
                <div
                  className={`w-full rounded-t-lg border-2 border-ink ${d.minutes >= profile.dailyGoalMin ? "bg-mint" : "bg-grape"} ${
                    d.minutes === 0 ? "border-dashed bg-transparent" : ""
                  }`}
                  style={{ height: `${Math.max(d.minutes === 0 ? 4 : 8, (d.minutes / maxMin) * 100)}%` }}
                />
                <span className={`text-sm font-bold ${d.key === dayKey(new Date()) ? "text-ink" : "text-ink-soft"}`}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-ink-soft">
            Green bars met the {profile.dailyGoalMin}-minute daily goal.
          </p>
        </Panel>
      </section>

      <section aria-labelledby="skills">
        <h2 id="skills" className="mb-3 text-2xl font-black">
          Skills
        </h2>
        <p className="mb-4 max-w-[62ch] font-semibold text-ink-soft">
          The level is the average score of the last eight sessions. The arrow compares it to the eight sessions
          before that.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {skills.map((s) => {
            const m = KIND_META[s.kind];
            return (
              <li key={s.kind}>
                <Panel className="h-full">
                  <div className="flex items-center justify-between gap-2">
                    <KindBadge kind={s.kind} />
                    <span className="font-extrabold">
                      {s.trend === null ? "" : s.trend > 0 ? `▲ ${s.trend}` : s.trend < 0 ? `▼ ${Math.abs(s.trend)}` : "● steady"}
                    </span>
                  </div>
                  <p className="mt-3 text-4xl font-black">{s.level ?? "—"}</p>
                  <div className="mt-2">
                    <Meter value={s.level ?? 0} tone={TONES[s.kind]} label={`${m.label} level`} />
                  </div>
                  <p className="mt-3 font-semibold text-ink-soft">
                    {s.sessions} session{s.sessions === 1 ? "" : "s"} · {s.minutes} minutes in total
                  </p>
                </Panel>
              </li>
            );
          })}
        </ul>
      </section>

      <Panel tone="sun-tint">
        <h2 className="text-xl font-black">Suggestion for this week</h2>
        <p className="mt-1 font-semibold">{rec.text}</p>
      </Panel>

      <section aria-labelledby="recent">
        <h2 id="recent" className="mb-3 text-2xl font-black">
          Recent activity
        </h2>
        {recent.length === 0 ? (
          <p className="font-semibold text-ink-soft">Nothing yet. Activities will appear here as {profile.name} completes them.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink bg-white px-4 py-3">
                <KindBadge kind={a.kind} />
                <span className="font-extrabold">{a.title}</span>
                <span className="text-sm font-semibold text-ink-soft">
                  {new Date(a.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ·{" "}
                  {Math.max(1, Math.round(a.seconds / 60))} min
                </span>
                <span className="ml-auto rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-black">{a.score}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Settings({ profile, onDeleted }: { profile: Profile; onDeleted: () => void }) {
  const { state } = useStore();
  const [confirming, setConfirming] = useState(false);
  const [newPin, setNewPin] = useState("");

  function download() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brightmind-backup-${dayKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section aria-labelledby="settings">
      <h2 id="settings" className="mb-3 text-2xl font-black">
        Settings for {profile.name}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <label htmlFor="goal" className="text-lg font-black">
            Daily practice goal
          </label>
          <select
            id="goal"
            value={profile.dailyGoalMin}
            onChange={(e) => updateProfile(profile.id, { dailyGoalMin: Number(e.target.value) })}
            className="mt-2 w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-lg font-bold"
          >
            {[10, 15, 20, 30, 45, 60].map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
        </Panel>

        <Panel>
          <h3 className="text-lg font-black">Change parent PIN</h3>
          <div className="mt-2 flex gap-2">
            <input
              aria-label="New 4-digit PIN"
              inputMode="numeric"
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-xl font-black tracking-[0.4em]"
            />
            <Button
              tone="white"
              disabled={newPin.length !== 4}
              onClick={() => {
                setPin(newPin);
                setNewPin("");
              }}
            >
              Save
            </Button>
          </div>
        </Panel>

        <Panel>
          <h3 className="text-lg font-black">Back up all data</h3>
          <p className="mt-1 font-semibold text-ink-soft">
            Progress lives in this browser. Download a copy before clearing browser data or switching devices.
          </p>
          <div className="mt-3">
            <Button tone="white" onClick={download}>
              Download backup
            </Button>
          </div>
        </Panel>

        <Panel tone="coral-tint">
          <h3 className="text-lg font-black">Delete {profile.name}</h3>
          <p className="mt-1 font-semibold">
            This removes the player and all of their progress from this device.
          </p>
          <div className="mt-3 flex gap-2">
            {confirming ? (
              <>
                <Button
                  tone="coral"
                  onClick={() => {
                    deleteProfile(profile.id);
                    onDeleted();
                  }}
                >
                  Yes, delete permanently
                </Button>
                <Button tone="white" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button tone="white" onClick={() => setConfirming(true)} disabled={state.profiles.length === 0}>
                Delete player
              </Button>
            )}
          </div>
        </Panel>
      </div>
    </section>
  );
}
