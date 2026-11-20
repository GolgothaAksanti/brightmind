"use client";

import { useEffect, useRef, useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { Button, Meter, Panel } from "@/components/ui";
import type { RecordInput } from "@/lib/store";
import { pick, shuffle } from "@/lib/speech";

const PAIRS: [string, string][] = [
  ["b", "d"],
  ["p", "q"],
  ["m", "n"],
  ["u", "n"],
  ["6", "9"],
  ["E", "F"],
  ["O", "Q"],
];
const ROUNDS = 5;
const ROUND_SECONDS = 25;
const COLS = 6;

interface Round {
  base: string;
  target: string;
  cells: boolean[]; // true = target
  count: number;
}

function makeRound(r: number): Round {
  const [a, b] = pick(PAIRS);
  const flip = Math.random() < 0.5;
  const rows = 4 + Math.min(2, Math.floor(r / 2));
  const total = rows * COLS;
  const count = 3 + r;
  const cells = shuffle(Array.from({ length: total }, (_, i) => i < count));
  return { base: flip ? a : b, target: flip ? b : a, cells, count };
}

type Phase = "intro" | "play" | "between" | "over";

export function Target() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [r, setR] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<Set<number>>(new Set());
  const [left, setLeft] = useState(ROUND_SECONDS);
  const [scores, setScores] = useState<number[]>([]);
  const [totals, setTotals] = useState({ found: 0, targets: 0, errors: 0 });
  const [input, setInput] = useState<RecordInput | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const deadline = useRef(0);
  const started = useRef(0);

  function begin() {
    started.current = Date.now();
    setScores([]);
    setTotals({ found: 0, targets: 0, errors: 0 });
    setInput(null);
    startRound(0);
  }

  function startRound(index: number) {
    setR(index);
    setRound(makeRound(index));
    setFound(new Set());
    setWrong(new Set());
    setLeft(ROUND_SECONDS);
    deadline.current = Date.now() + ROUND_SECONDS * 1000;
    setPhase("play");
  }

  function endRound(foundCount: number, errors: number, remaining: number) {
    if (!round) return;
    const accuracy = foundCount / round.count;
    const speed = remaining / ROUND_SECONDS;
    const s = Math.max(0, Math.round(accuracy * 75 + accuracy * speed * 25 - errors * 6));
    setRoundScore(s);
    const nextScores = [...scores, s];
    setScores(nextScores);
    setTotals((t) => ({
      found: t.found + foundCount,
      targets: t.targets + round.count,
      errors: t.errors + errors,
    }));
    if (r + 1 >= ROUNDS) {
      const avg = nextScores.reduce((a, b) => a + b, 0) / nextScores.length;
      setInput({
        kind: "focus",
        game: "target",
        title: "Target Hunt",
        score: avg,
        seconds: (Date.now() - started.current) / 1000,
      });
      setPhase("over");
    } else {
      setPhase("between");
    }
  }

  // Countdown, driven by the clock so background throttling cannot cheat it.
  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining <= 0) {
        clearInterval(t);
        endRound(found.size, wrong.size, 0);
      }
    }, 250);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, found, wrong]);

  function tap(i: number) {
    if (phase !== "play" || !round || found.has(i) || wrong.has(i)) return;
    if (round.cells[i]) {
      const nf = new Set(found).add(i);
      setFound(nf);
      if (nf.size === round.count) {
        const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
        endRound(nf.size, wrong.size, remaining);
      }
    } else {
      setWrong(new Set(wrong).add(i));
    }
  }

  if (phase === "over" && input) {
    return (
      <ResultCard
        input={input}
        again={begin}
        backHref="/focus"
        backLabel="Back to focus"
        details={
          <p>
            You found <strong>{totals.found}</strong> of <strong>{totals.targets}</strong> targets with{" "}
            <strong>{totals.errors}</strong> wrong tap{totals.errors === 1 ? "" : "s"}.
          </p>
        }
      />
    );
  }

  if (phase === "intro") {
    return (
      <Panel tone="mint-tint" className="mx-auto max-w-xl">
        <h2 className="text-2xl font-black">How it works</h2>
        <p className="mt-2 font-semibold">
          Each round shows a grid of look-alike characters. Tap every character that matches the target before the
          time runs out. Wrong taps cost points, so slow down enough to be accurate.
        </p>
        <p className="mt-2 font-semibold text-ink-soft">
          {ROUNDS} rounds, {ROUND_SECONDS} seconds each. The grids get bigger and the targets get more.
        </p>
        <div className="mt-5">
          <Button tone="mint" onClick={begin}>
            Start round 1
          </Button>
        </div>
      </Panel>
    );
  }

  if (!round) return null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border-2 border-ink bg-white px-3 py-1 font-extrabold">
          Round {r + 1} of {ROUNDS}
        </span>
        <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 font-extrabold" aria-live="off">
          {left}s
        </span>
      </div>
      <Meter value={(left / ROUND_SECONDS) * 100} tone="mint" label="Time left" />

      <Panel tone="mint-tint" className="mt-5">
        <p className="text-center text-xl font-black">
          Find every{" "}
          <span className="mx-1 inline-grid h-12 w-12 place-items-center rounded-xl border-2 border-ink bg-white text-3xl">
            {round.target}
          </span>{" "}
          <span className="text-base font-bold text-ink-soft">
            ({found.size} of {round.count} found)
          </span>
        </p>

        <div
          className="mx-auto mt-5 grid max-w-md gap-2"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          role="group"
          aria-label="Character grid"
        >
          {round.cells.map((isTarget, i) => {
            const state = found.has(i) ? "found" : wrong.has(i) ? "wrong" : "idle";
            return (
              <button
                key={i}
                onClick={() => tap(i)}
                disabled={phase !== "play" || state !== "idle"}
                aria-label={`Character ${isTarget ? round.target : round.base}${state === "found" ? ", found" : state === "wrong" ? ", wrong" : ""}`}
                className={`aspect-square rounded-xl border-2 border-ink text-3xl font-black transition-colors ${
                  state === "found" ? "bg-mint" : state === "wrong" ? "bg-coral" : "bg-white hover:bg-sun-tint"
                }`}
              >
                {isTarget ? round.target : round.base}
              </button>
            );
          })}
        </div>

        {phase === "between" && (
          <div role="status" className="mt-5 animate-pop rounded-2xl border-2 border-ink bg-white p-4 text-center">
            <p className="text-xl font-black">Round score: {roundScore}</p>
            <div className="mt-3">
              <Button tone="mint" onClick={() => startRound(r + 1)}>
                Start round {r + 2}
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
