"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button, LinkButton, Meter, Panel } from "@/components/ui";
import { recordActivity, type RecordInput } from "@/lib/store";
import type { Activity } from "@/lib/types";

function praise(score: number): string {
  if (score >= 90) return "Outstanding work!";
  if (score >= 75) return "Strong session!";
  if (score >= 55) return "Solid effort. You are getting there.";
  return "Every round makes the next one easier.";
}

/**
 * Saves an activity once when it mounts, then shows the outcome.
 * Pass a stable `input`; use `key` on the component to reset between runs.
 */
export function ResultCard({
  input,
  details,
  again,
  backHref,
  backLabel,
}: {
  input: RecordInput;
  details?: ReactNode;
  again?: () => void;
  backHref: string;
  backLabel: string;
}) {
  const [saved, setSaved] = useState<Activity | null>(null);
  const done = useRef(false);

  // The ref guard keeps React Strict Mode's double effect from saving twice.
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    setSaved(recordActivity(input));
  }, [input]);

  const score = saved?.score ?? Math.max(0, Math.min(100, Math.round(input.score)));

  return (
    <Panel tone="mint-tint" className="mx-auto max-w-xl animate-pop text-center">
      <p className="text-5xl" aria-hidden>
        {score >= 75 ? "🏆" : score >= 55 ? "⭐" : "💪"}
      </p>
      <h2 className="mt-2 text-3xl font-black">{praise(score)}</h2>
      <div className="mx-auto mt-5 max-w-xs">
        <p className="text-6xl font-black leading-none">{score}</p>
        <p className="mt-1 font-bold text-ink-soft">score out of 100</p>
        <div className="mt-3">
          <Meter value={score} tone="mint" label="Score" />
        </div>
      </div>
      {saved && (
        <p className="mt-4 inline-block rounded-full border-2 border-ink bg-sun px-4 py-1 font-extrabold">
          +{saved.xp} XP
        </p>
      )}
      {details && <div className="mt-4 text-left font-semibold">{details}</div>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {again && (
          <Button tone="grape" onClick={again}>
            Play again
          </Button>
        )}
        <LinkButton href={backHref} tone="white">
          {backLabel}
        </LinkButton>
      </div>
    </Panel>
  );
}
