"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { passages } from "@/lib/content/passages";
import { useActiveProfile } from "@/lib/store";
import { readingSpeed } from "@/lib/skills";

const levelLabel = { 1: "Warm-up", 2: "Standard", 3: "Stretch" } as const;

export default function ReadHome() {
  const { profile } = useActiveProfile();
  const acts = profile?.activities ?? [];
  const wpm = readingSpeed(acts);

  return (
    <>
      <PageHeader
        kind="reading"
        title="Read and understand"
        intro="Read a passage, then answer questions about what it says, what it means and the words inside it."
      />

      {wpm && (
        <p className="mb-6 inline-block rounded-full border-2 border-ink bg-grape-tint px-4 py-1.5 font-extrabold">
          Your recent reading speed: about {wpm} words per minute
        </p>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {passages.map((p) => {
          const tries = acts.filter((a) => a.meta?.key === `passage:${p.id}`);
          const best = tries.length ? Math.max(...tries.map((a) => a.score)) : null;
          return (
            <li key={p.id}>
              <Link
                href={`/read/${p.id}`}
                className="sticker group flex h-full flex-col rounded-[22px] bg-white p-5 transition-transform hover:-translate-y-1"
              >
                <span className="text-4xl" aria-hidden>
                  {p.emoji}
                </span>
                <h2 className="mt-3 text-xl font-black leading-snug">{p.title}</h2>
                <p className="mt-2 flex flex-wrap gap-2 text-sm font-extrabold">
                  <span className="rounded-full border-2 border-ink bg-grape-tint px-2.5 py-0.5">{p.genre}</span>
                  <span className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5">{levelLabel[p.level]}</span>
                </p>
                <p className="mt-auto pt-4 font-bold text-ink-soft">
                  {best !== null ? `Best score: ${best}` : "Not read yet"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
