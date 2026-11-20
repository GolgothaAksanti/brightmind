"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useActiveProfile } from "@/lib/store";
import { bestScore } from "@/lib/skills";

const games = [
  {
    href: "/focus/sprint",
    game: "sprint",
    emoji: "⏳",
    title: "Focus Sprint",
    blurb: "Work on one real task for 2 to 25 minutes. The app notices when you wander off.",
    tone: "bg-mint",
  },
  {
    href: "/focus/sequence",
    game: "sequence",
    emoji: "🧠",
    title: "Memory Sequence",
    blurb: "Watch tiles light up, then repeat the order. Sequences grow longer as you improve.",
    tone: "bg-white",
  },
  {
    href: "/focus/target",
    game: "target",
    emoji: "🔎",
    title: "Target Hunt",
    blurb: "Spot every b hiding among the d's. Trains careful scanning, which also helps reading.",
    tone: "bg-white",
  },
];

export default function FocusHome() {
  const { profile } = useActiveProfile();
  const acts = profile?.activities ?? [];

  return (
    <>
      <PageHeader
        kind="focus"
        title="Train your attention"
        intro="Focus is a skill that grows with practice, like a muscle. Short, regular sessions work better than one long one."
      />
      <ul className="grid gap-5 md:grid-cols-3">
        {games.map((g) => {
          const best = bestScore(acts, g.game);
          return (
            <li key={g.href}>
              <Link
                href={g.href}
                className={`sticker flex h-full flex-col rounded-[22px] p-5 transition-transform hover:-translate-y-1 ${g.tone}`}
              >
                <span className="text-4xl" aria-hidden>
                  {g.emoji}
                </span>
                <h2 className="mt-3 text-2xl font-black">{g.title}</h2>
                <p className="mt-2 font-semibold">{g.blurb}</p>
                <p className="mt-auto pt-4 font-extrabold">{best !== null ? `Best score: ${best}` : "Not played yet"}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
