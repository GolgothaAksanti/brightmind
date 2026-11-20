"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, PageHeader, Panel } from "@/components/ui";
import { levelInfo, totalXp } from "@/lib/skills";
import { createProfile, setActive, useStore } from "@/lib/store";
import { AVATARS } from "@/lib/types";

export default function ProfilesPage() {
  const router = useRouter();
  const { state, ready } = useStore();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [adding, setAdding] = useState(false);

  if (!ready) return <div className="h-96" aria-hidden />;

  const showForm = adding || state.profiles.length === 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createProfile(name, avatar);
    router.push("/");
  }

  return (
    <>
      <PageHeader
        title="Who is playing?"
        intro="Each player has their own scores, streak and level. Parents can see everyone in the Parents area."
      />

      {state.profiles.length > 0 && (
        <ul className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.profiles.map((p) => {
            const info = levelInfo(totalXp(p));
            const active = p.id === state.activeId;
            return (
              <li key={p.id}>
                <button
                  onClick={() => {
                    setActive(p.id);
                    router.push("/");
                  }}
                  aria-pressed={active}
                  className={`sticker flex w-full items-center gap-4 rounded-[22px] p-4 text-left transition-transform hover:-translate-y-1 ${
                    active ? "bg-sun" : "bg-white"
                  }`}
                >
                  <span className="text-5xl" aria-hidden>
                    {p.avatar}
                  </span>
                  <span>
                    <span className="block text-2xl font-black">{p.name}</span>
                    <span className="block font-bold text-ink-soft">
                      Level {info.level}
                      {active ? " · playing now" : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showForm ? (
        <Panel tone="coral-tint" className="max-w-xl">
          <form onSubmit={submit}>
            <h2 className="text-2xl font-black">New player</h2>
            <label className="mt-4 block">
              <span className="font-extrabold">First name or nickname</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                autoFocus
                className="mt-1 w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-xl font-bold"
              />
            </label>

            <fieldset className="mt-5">
              <legend className="font-extrabold">Pick an avatar</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATARS.map((a) => (
                  <label
                    key={a}
                    className={`grid h-14 w-14 cursor-pointer place-items-center rounded-2xl border-2 border-ink text-3xl ${
                      avatar === a ? "bg-sun shadow-sticker-sm" : "bg-white hover:bg-sun-tint"
                    }`}
                  >
                    <input
                      type="radio"
                      name="avatar"
                      value={a}
                      checked={avatar === a}
                      onChange={() => setAvatar(a)}
                      className="sr-only"
                    />
                    <span aria-hidden>{a}</span>
                    <span className="sr-only">Avatar {a}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-4 text-sm font-semibold text-ink-soft">
              Only a first name or nickname is needed. Please do not use a full name.
            </p>

            <div className="mt-5 flex gap-3">
              <Button type="submit" tone="coral" disabled={!name.trim()}>
                Create player
              </Button>
              {state.profiles.length > 0 && (
                <Button type="button" tone="white" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Panel>
      ) : (
        <Button tone="coral" onClick={() => setAdding(true)}>
          Add another player
        </Button>
      )}
    </>
  );
}
