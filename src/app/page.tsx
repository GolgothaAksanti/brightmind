"use client";

import Link from "next/link";
import { LinkButton, Meter, Panel, Stat } from "@/components/ui";
import { dayKey, levelInfo, minutesOn, recommendation, streak, todayKinds, totalXp } from "@/lib/skills";
import { useActiveProfile } from "@/lib/store";
import { KINDS, KIND_META } from "@/lib/types";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { profile, ready } = useActiveProfile();

  if (!ready) return <div className="h-96" aria-hidden />;

  if (!profile) {
    return (
      <div>
        <section className="max-w-3xl">
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
            Read well. Write well. Think sharply.
          </h1>
          <p className="mt-5 max-w-[56ch] text-xl font-semibold text-ink-soft">
            BrightMind gives children aged 10 to 12 a short daily trail of reading, writing, focus and puzzle
            activities, and gives parents a clear picture of how they are growing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href="/profiles" tone="coral" className="!px-8 !py-4 !text-lg">
              Create a player
            </LinkButton>
            <LinkButton href="/parent" tone="white" className="!px-8 !py-4 !text-lg">
              Parent area
            </LinkButton>
          </div>
        </section>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {KINDS.map((k) => {
            const m = KIND_META[k];
            return (
              <li key={k}>
                <div className={`sticker h-full rounded-[22px] p-5 ${m.tint}`}>
                  <span className="text-4xl" aria-hidden>
                    {m.emoji}
                  </span>
                  <h2 className="mt-3 text-2xl font-black">{m.label}</h2>
                  <p className="mt-1 font-semibold">{m.blurb}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const acts = profile.activities;
  const xp = totalXp(profile);
  const info = levelInfo(xp);
  const days = streak(acts);
  const today = dayKey(new Date());
  const minutes = minutesOn(acts, today);
  const goalPct = Math.min(100, (minutes / profile.dailyGoalMin) * 100);
  const doneToday = todayKinds(acts);
  const rec = recommendation(acts);
  const remaining = KINDS.filter((k) => !doneToday.has(k)).length;

  return (
    <div className="space-y-10">
      <section>
        <p className="text-lg font-extrabold text-ink-soft">{greeting()},</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl">
          {profile.name} <span aria-hidden>{profile.avatar}</span>
        </h1>
        <p className="mt-2 text-lg font-semibold text-ink-soft">
          {remaining === 0
            ? "You finished all four stops on today's trail. Brilliant."
            : `${remaining} stop${remaining === 1 ? "" : "s"} left on today's trail.`}
        </p>
      </section>

      <section aria-labelledby="trail">
        <h2 id="trail" className="mb-4 text-2xl font-black">
          Today&apos;s trail
        </h2>
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute left-[12%] right-[12%] top-[3.1rem] hidden border-t-[3px] border-dashed border-ink/40 lg:block"
          />
          {KINDS.map((k, i) => {
            const m = KIND_META[k];
            const done = doneToday.has(k);
            const suggested = rec.kind === k && !done;
            return (
              <li key={k} className="relative">
                <Link
                  href={m.href}
                  className={`sticker relative flex h-full flex-col items-start rounded-[22px] p-5 transition-transform hover:-translate-y-1 ${
                    done ? "bg-white" : m.tint
                  }`}
                >
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-full border-[2.5px] border-ink text-2xl ${
                      done ? "bg-mint" : m.bg
                    }`}
                    aria-hidden
                  >
                    {done ? "✓" : m.emoji}
                  </span>
                  <span className="mt-3 text-xl font-black">
                    Stop {i + 1}: {m.label}
                  </span>
                  <span className="mt-1 font-semibold text-ink-soft">{done ? "Done for today" : m.blurb}</span>
                  {suggested && (
                    <span className="mt-3 rounded-full border-2 border-ink bg-sun px-3 py-0.5 text-sm font-extrabold">
                      Suggested next
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Level {info.level}</h2>
              <p className="font-semibold text-ink-soft">
                {info.into} of {info.span} XP to level {info.level + 1}
              </p>
            </div>
            <p className="text-4xl font-black">{xp} XP</p>
          </div>
          <div className="mt-3">
            <Meter value={info.pct * 100} tone="grape" label="Progress to next level" />
          </div>

          <h3 className="mt-6 text-lg font-black">Today&apos;s practice</h3>
          <p className="font-semibold text-ink-soft">
            {minutes} of {profile.dailyGoalMin} minutes
          </p>
          <div className="mt-2">
            <Meter value={goalPct} tone="mint" label="Daily goal" />
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-4 content-start">
          <Stat value={`${days} day${days === 1 ? "" : "s"}`} label="Practice streak" />
          <Stat value={acts.length} label="Activities finished" />
          <div className="col-span-2 rounded-2xl border-2 border-ink bg-sun-tint p-4 font-bold">{rec.text}</div>
        </div>
      </section>
    </div>
  );
}
