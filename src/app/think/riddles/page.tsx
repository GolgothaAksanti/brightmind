"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { riddles } from "@/lib/content/riddles";
import { useActiveProfile } from "@/lib/store";

const levelLabel = { 1: "Easy", 2: "Medium", 3: "Tricky" } as const;

export default function RiddleList() {
  const { profile } = useActiveProfile();
  const acts = profile?.activities ?? [];

  return (
    <>
      <PageHeader
        kind="problem"
        title="Riddle Rooms"
        back={{ href: "/think", label: "Thinking" }}
        intro="Read carefully, reason it out, and only use a hint when you are truly stuck."
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {riddles.map((r) => {
          const tries = acts.filter((a) => a.meta?.key === `riddle:${r.id}`);
          const best = tries.length ? Math.max(...tries.map((a) => a.score)) : null;
          return (
            <li key={r.id}>
              <Link
                href={`/think/riddles/${r.id}`}
                className="sticker flex h-full flex-col rounded-[22px] bg-white p-5 transition-transform hover:-translate-y-1"
              >
                <span className="w-fit rounded-full border-2 border-ink bg-sun-tint px-3 py-0.5 text-sm font-extrabold">
                  {levelLabel[r.level]}
                </span>
                <h2 className="mt-3 text-xl font-black">{r.title}</h2>
                <p className="mt-auto pt-4 font-bold text-ink-soft">
                  {best !== null ? `Solved. Best score: ${best}` : "Unsolved"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
