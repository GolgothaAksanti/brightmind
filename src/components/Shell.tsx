"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useActiveProfile } from "@/lib/store";
import { levelInfo, totalXp } from "@/lib/skills";
import { KINDS, KIND_META } from "@/lib/types";

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { profile } = useActiveProfile();
  const info = profile ? levelInfo(totalXp(profile)) : null;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b-[2.5px] border-ink bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-sun text-lg shadow-sticker-sm"
            >
              ✦
            </span>
            BrightMind
          </Link>

          <nav aria-label="Main" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:flex-1">
            {KINDS.map((k) => {
              const m = KIND_META[k];
              const active = pathname.startsWith(m.href);
              return (
                <Link
                  key={k}
                  href={m.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-extrabold transition-colors ${
                    active ? `border-ink ${m.bg} ${k === "reading" ? "text-white" : "text-ink"}` : "border-transparent hover:border-ink hover:bg-paper-deep"
                  }`}
                >
                  <span aria-hidden>{m.emoji}</span>
                  {m.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {profile && info ? (
              <Link
                href="/profiles"
                className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-extrabold hover:bg-paper-deep"
                aria-label={`${profile.name}, level ${info.level}. Switch profile`}
              >
                <span aria-hidden className="text-xl leading-none">{profile.avatar}</span>
                <span>{profile.name}</span>
                <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-white">Lv {info.level}</span>
              </Link>
            ) : (
              <Link href="/profiles" className="text-sm font-extrabold underline decoration-2 underline-offset-4">
                Add a player
              </Link>
            )}
            <Link
              href="/parent"
              className="rounded-full border-2 border-ink px-3 py-1.5 text-sm font-extrabold hover:bg-paper-deep"
            >
              Parents
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t-2 border-ink/15 px-4 py-6 text-center text-sm font-semibold text-ink-soft">
        Progress is saved on this device only. No accounts, no tracking.
      </footer>
    </>
  );
}
