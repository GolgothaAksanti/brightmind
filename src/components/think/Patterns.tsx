"use client";

import { useEffect, useRef, useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { Button, Meter, Panel } from "@/components/ui";
import { makePattern, type PatternQuestion } from "@/lib/patterns";
import type { RecordInput } from "@/lib/store";
import { useActiveProfile } from "@/lib/store";
import { nowMs } from "@/lib/speech";

const QUESTIONS = 10;

export function Patterns() {
  const { profile } = useActiveProfile();
  const [run, setRun] = useState(0);
  const startLevel = (() => {
    const recent = (profile?.activities ?? []).filter((a) => a.game === "patterns").slice(-3);
    if (!recent.length) return 1;
    const avg = recent.reduce((n, a) => n + a.score, 0) / recent.length;
    return avg >= 80 ? 3 : avg >= 55 ? 2 : 1;
  })();
  return <Game key={run} startLevel={startLevel} onAgain={() => setRun((r) => r + 1)} />;
}

function Game({ startLevel, onAgain }: { startLevel: number; onAgain: () => void }) {
  const [i, setI] = useState(0);
  const [level, setLevel] = useState(startLevel);
  const [q, setQ] = useState<PatternQuestion>(() => makePattern(startLevel));
  const [picked, setPicked] = useState<number | string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [input, setInput] = useState<RecordInput | null>(null);
  const started = useRef(0);
  const qStart = useRef(0);

  useEffect(() => {
    started.current = nowMs();
    qStart.current = started.current;
  }, []);

  function choose(o: number | string) {
    if (picked !== null) return;
    setPicked(o);
    const ok = o === q.answer;
    if (ok) {
      const secs = (nowMs() - qStart.current) / 1000;
      const speed = secs < 6 ? 1 : secs < 12 ? 0.75 : 0.55;
      setPoints((p) => p + q.level * speed * 10);
      setCorrect((c) => c + 1);
      const s = streak + 1;
      setStreak(s);
      if (s >= 2 && level < 3) {
        setLevel(level + 1);
        setStreak(0);
      }
    } else {
      setStreak(0);
      if (level > 1) setLevel(level - 1);
    }
  }

  function next() {
    if (i + 1 >= QUESTIONS) {
      // Max possible is about 10 * level 3 * 10, but most children play across levels,
      // so score is mostly about accuracy with a bonus for harder questions.
      const accuracy = correct / QUESTIONS;
      const difficultyBonus = Math.min(1, points / (QUESTIONS * 2 * 10));
      setInput({
        kind: "problem",
        game: "patterns",
        title: "Pattern Lab",
        score: accuracy * 70 + difficultyBonus * 30,
        seconds: (nowMs() - started.current) / 1000,
        meta: { correct, total: QUESTIONS, peakLevel: level },
      });
      return;
    }
    setI(i + 1);
    setQ(makePattern(level));
    setPicked(null);
    qStart.current = nowMs();
  }

  if (input) {
    return (
      <ResultCard
        input={input}
        again={onAgain}
        backHref="/think"
        backLabel="Back to thinking"
        details={
          <p>
            You found <strong>{correct}</strong> of <strong>{QUESTIONS}</strong> patterns. Questions got harder as you
            got them right, so a high score here means you handled tough ones.
          </p>
        }
      />
    );
  }

  const answered = picked !== null;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border-2 border-ink bg-white px-3 py-1 font-extrabold">
          Question {i + 1} of {QUESTIONS}
        </span>
        <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 font-extrabold">Difficulty {q.level}/3</span>
      </div>
      <Meter value={(i / QUESTIONS) * 100} tone="sun" label="Progress" />

      <Panel tone="sun-tint" className="mt-6">
        <h2 className="text-xl font-black">What number comes next?</h2>
        <ol className="mt-5 flex flex-wrap items-center gap-2 text-3xl font-black" aria-label="Number sequence">
          {q.shown.map((n, idx) => (
            <li key={idx} className="grid min-w-14 place-items-center rounded-xl border-2 border-ink bg-white px-3 py-2">
              {n}
            </li>
          ))}
          <li className="grid min-w-14 place-items-center rounded-xl border-2 border-dashed border-ink bg-sun px-3 py-2" aria-label="missing number">
            ?
          </li>
        </ol>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {q.options.map((o) => {
            const isRight = o === q.answer;
            let style = "bg-white hover:bg-sun";
            if (answered && isRight) style = "bg-mint";
            else if (answered && o === picked) style = "bg-coral animate-shake";
            else if (answered) style = "bg-white opacity-60";
            return (
              <li key={o}>
                <button
                  onClick={() => choose(o)}
                  disabled={answered}
                  className={`w-full rounded-2xl border-[2.5px] border-ink py-4 text-2xl font-black ${style}`}
                >
                  {o}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div role="status" className="mt-5 animate-pop rounded-2xl border-2 border-ink bg-white p-4 font-semibold">
            <p className="font-black">{picked === q.answer ? "Correct!" : `Not quite. The answer is ${q.answer}.`}</p>
            <p>The rule: {q.rule}</p>
            <div className="mt-3">
              <Button tone="sun" onClick={next}>
                {i + 1 < QUESTIONS ? "Next pattern" : "See my results"}
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
