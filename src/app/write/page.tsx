"use client";

import Link from "next/link";
import { PageHeader, Panel } from "@/components/ui";
import { writingPrompts } from "@/lib/content/writing";
import { useActiveProfile } from "@/lib/store";

export default function WriteHome() {
  const { profile } = useActiveProfile();
  const acts = profile?.activities ?? [];

  return (
    <>
      <PageHeader
        kind="writing"
        title="Plan, draft and polish"
        intro="Strong writers plan first, write a messy draft, then fix it. Pick a prompt and work through all three steps."
      />

      <Link
        href="/write/spelling"
        className="sticker mb-8 flex flex-wrap items-center gap-4 rounded-[22px] bg-sun p-5 transition-transform hover:-translate-y-1"
      >
        <span className="text-4xl" aria-hidden>
          🔤
        </span>
        <span>
          <span className="block text-2xl font-black">Spelling Studio</span>
          <span className="block font-bold">Listen, spell the tricky word, learn the memory trick.</span>
        </span>
      </Link>

      <ul className="grid gap-5 sm:grid-cols-2">
        {writingPrompts.map((p) => {
          const tries = acts.filter((a) => a.meta?.key === `write:${p.id}`);
          const best = tries.length ? Math.max(...tries.map((a) => a.score)) : null;
          return (
            <li key={p.id}>
              <Link
                href={`/write/${p.id}`}
                className="sticker flex h-full flex-col rounded-[22px] bg-white p-5 transition-transform hover:-translate-y-1"
              >
                <span className="w-fit rounded-full border-2 border-ink bg-coral-tint px-3 py-0.5 text-sm font-extrabold">
                  {p.type}
                </span>
                <h2 className="mt-3 text-xl font-black leading-snug">{p.title}</h2>
                <p className="mt-2 line-clamp-3 font-semibold text-ink-soft">{p.prompt}</p>
                <p className="mt-auto pt-4 font-bold text-ink-soft">
                  {best !== null ? `Best score: ${best}` : `${p.min} to ${p.max} words`}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <Panel tone="coral-tint" className="mt-10 max-w-2xl">
        <h2 className="text-xl font-black">A note on scoring</h2>
        <p className="mt-1 font-semibold">
          Scores reward planning, length, your own checklist and clean sentences. They cannot judge how good your
          ideas are, so share your best pieces with someone and talk about them.
        </p>
      </Panel>
    </>
  );
}
