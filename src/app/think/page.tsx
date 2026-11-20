"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useActiveProfile } from "@/lib/store";
import { bestScore } from "@/lib/skills";

const games = [
  {
    href: "/think/patterns",
    game: "patterns",
    emoji: "🔢",
    title: "Pattern Lab",
    blurb: "Find the rule hiding in a number sequence. The difficulty adapts to how you are doing.",
  },
  {
    href: "/think/riddles",
    game: "riddle",
    emoji: "🕵️",
    title: "Riddle Rooms",
    blurb: "Classic logic puzzles with three hint levels. Fewer hints means a higher score.",
  },
  {
    href: "/think/code",
    game: "code",
    emoji: "🔐",
    title: "Code Cracker",
    blurb: "Crack a secret number code using clue feedback. Pure deduction, no luck needed.",
  },
];

export default function ThinkHome() {
  const { profile } = useActiveProfile();
  const acts = profile?.activities ?? [];

  return (
    <>
      <PageHeader
        kind="problem"
        title="Solve it"
        intro="Break a hard problem into small questions, test an idea, and learn from what does not work. That is how problem solvers think."
      />
      <ul className="grid gap-5 md:grid-cols-3">
        {games.map((g) => {
          const best = bestScore(acts, g.game);
          return (
            <li key={g.href}>
              <Link
                href={g.href}
                className="sticker flex h-full flex-col rounded-[22px] bg-white p-5 transition-transform hover:-translate-y-1"
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
