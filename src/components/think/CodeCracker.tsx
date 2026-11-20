"use client";

import { useRef, useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { Button, Panel } from "@/components/ui";
import type { RecordInput } from "@/lib/store";
import { shuffle } from "@/lib/speech";

const DIGITS = [1, 2, 3, 4, 5, 6];
const MAX_GUESSES = 8;

interface Guess {
  digits: number[];
  exact: number;
  misplaced: number;
}

function score(secret: number[], guess: number[]) {
  let exact = 0;
  const sCount = new Map<number, number>();
  const gCount = new Map<number, number>();
  guess.forEach((g, i) => {
    if (g === secret[i]) exact++;
    else {
      sCount.set(secret[i], (sCount.get(secret[i]) ?? 0) + 1);
      gCount.set(g, (gCount.get(g) ?? 0) + 1);
    }
  });
  let misplaced = 0;
  gCount.forEach((n, d) => {
    misplaced += Math.min(n, sCount.get(d) ?? 0);
  });
  return { exact, misplaced };
}

export function CodeCracker() {
  const [run, setRun] = useState(0);
  return <Game key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function Game({ onAgain }: { onAgain: () => void }) {
  const [length, setLength] = useState<3 | 4 | null>(null);
  const [secret, setSecret] = useState<number[]>([]);
  const [current, setCurrent] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState<RecordInput | null>(null);
  const started = useRef(0);

  function begin(len: 3 | 4) {
    // Distinct digits keep the logic clean for beginners.
    setSecret(shuffle(DIGITS).slice(0, len));
    setLength(len);
    setCurrent([]);
    setGuesses([]);
    started.current = Date.now();
  }

  function add(d: number) {
    if (!length || current.length >= length || current.includes(d)) return;
    setCurrent([...current, d]);
  }

  function submit() {
    if (!length || current.length !== length) return;
    const r = score(secret, current);
    const g = [...guesses, { digits: current, ...r }];
    setGuesses(g);
    setCurrent([]);
    const won = r.exact === length;
    if (won || g.length >= MAX_GUESSES) {
      const winScore = 100 - (g.length - 1) * (length === 3 ? 10 : 8);
      setInput({
        kind: "problem",
        game: "code",
        title: `Code Cracker (${length} digits)`,
        score: won ? Math.max(25, winScore) : 15,
        seconds: (Date.now() - started.current) / 1000,
        meta: { won: won ? 1 : 0, guesses: g.length, length },
      });
    }
  }

  if (input) {
    const won = Number(input.meta?.won) === 1;
    return (
      <ResultCard
        input={input}
        again={onAgain}
        backHref="/think"
        backLabel="Back to thinking"
        details={
          <p>
            {won ? (
              <>
                You cracked the code in <strong>{String(input.meta?.guesses)}</strong> guess
                {input.meta?.guesses === 1 ? "" : "es"}.
              </>
            ) : (
              <>
                The code was <strong>{secret.join(" ")}</strong>. Look back at your clues to see where the reasoning
                could have gone differently.
              </>
            )}
          </p>
        }
      />
    );
  }

  if (!length) {
    return (
      <Panel tone="sun-tint" className="mx-auto max-w-xl">
        <h2 className="text-2xl font-black">Crack the secret code</h2>
        <p className="mt-2 font-semibold">
          The code uses digits from 1 to 6, and no digit repeats. After each guess you get two clues:
        </p>
        <ul className="mt-3 space-y-2 font-semibold">
          <li>
            <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-ink bg-mint align-middle" />
            Right digit, right place
          </li>
          <li>
            <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-ink bg-sun align-middle" />
            Right digit, wrong place
          </li>
        </ul>
        <p className="mt-3 font-semibold text-ink-soft">You have {MAX_GUESSES} guesses. Use the clues to reason it out.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button tone="sun" onClick={() => begin(3)}>
            3 digits (easier)
          </Button>
          <Button tone="white" onClick={() => begin(4)}>
            4 digits (harder)
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Panel tone="sun-tint">
        <p className="font-extrabold">
          Guess {guesses.length + 1} of {MAX_GUESSES}
        </p>

        <ol className="mt-4 space-y-2" aria-label="Previous guesses">
          {guesses.map((g, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border-2 border-ink bg-white p-2">
              <span className="w-6 text-center text-sm font-black text-ink-soft">{i + 1}</span>
              <span className="flex gap-1.5">
                {g.digits.map((d, j) => (
                  <span key={j} className="grid h-10 w-10 place-items-center rounded-lg border-2 border-ink bg-paper text-xl font-black">
                    {d}
                  </span>
                ))}
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-black" aria-label={`${g.exact} in the right place, ${g.misplaced} in the wrong place`}>
                <span className="grid h-7 min-w-7 place-items-center rounded-full border-2 border-ink bg-mint px-1.5 text-sm">{g.exact}</span>
                <span className="grid h-7 min-w-7 place-items-center rounded-full border-2 border-ink bg-sun px-1.5 text-sm">{g.misplaced}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex gap-2" aria-label="Your current guess">
          {Array.from({ length }).map((_, i) => (
            <span
              key={i}
              className="grid h-14 w-14 place-items-center rounded-xl border-[2.5px] border-dashed border-ink bg-white text-3xl font-black"
            >
              {current[i] ?? ""}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {DIGITS.map((d) => (
            <button
              key={d}
              onClick={() => add(d)}
              disabled={current.includes(d) || current.length >= length}
              className="h-14 w-14 rounded-xl border-[2.5px] border-ink bg-white text-2xl font-black shadow-sticker-sm hover:bg-sun disabled:opacity-40"
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button tone="white" onClick={() => setCurrent(current.slice(0, -1))} disabled={!current.length}>
            Delete
          </Button>
          <Button tone="sun" onClick={submit} disabled={current.length !== length}>
            Test this code
          </Button>
        </div>
      </Panel>
    </div>
  );
}
