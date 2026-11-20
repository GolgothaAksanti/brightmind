"use client";

import { useEffect, useRef, useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { Button, Panel } from "@/components/ui";
import { getRiddle } from "@/lib/content/riddles";
import type { RecordInput } from "@/lib/store";
import { nowMs } from "@/lib/speech";

export function RiddleRoom({ id }: { id: string }) {
  const riddle = getRiddle(id)!;
  const [hints, setHints] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongs, setWrongs] = useState<number[]>([]);
  const [input, setInput] = useState<RecordInput | null>(null);
  const started = useRef(0);

  useEffect(() => {
    started.current = nowMs();
  }, []);

  function choose(i: number) {
    if (picked !== null || wrongs.includes(i)) return;
    if (i === riddle.answer) {
      setPicked(i);
    } else {
      setWrongs((w) => [...w, i]);
    }
  }

  function finish() {
    // Start from 100, lose points for hints and wrong guesses.
    const score = Math.max(20, 100 - hints * 15 - wrongs.length * 15);
    setInput({
      kind: "problem",
      game: "riddle",
      title: riddle.title,
      score,
      seconds: (nowMs() - started.current) / 1000,
      meta: { key: `riddle:${id}`, hints, wrong: wrongs.length },
    });
  }

  if (input) {
    return (
      <ResultCard
        input={input}
        backHref="/think/riddles"
        backLabel="More riddles"
        details={
          <p>
            You used <strong>{hints}</strong> hint{hints === 1 ? "" : "s"} and made <strong>{wrongs.length}</strong>{" "}
            wrong guess{wrongs.length === 1 ? "" : "es"}. Solving it with fewer clues earns a higher score.
          </p>
        }
      />
    );
  }

  const solved = picked !== null;
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-black leading-tight">{riddle.title}</h1>
      <Panel tone="sun-tint" className="mt-6">
        <p className="text-xl font-bold leading-relaxed">{riddle.text}</p>

        <ul className="mt-5 grid gap-3">
          {riddle.options.map((o, i) => {
            const isRight = solved && i === riddle.answer;
            const isWrong = wrongs.includes(i);
            return (
              <li key={i}>
                <button
                  onClick={() => choose(i)}
                  disabled={solved || isWrong}
                  className={`w-full rounded-2xl border-[2.5px] border-ink px-4 py-3 text-left text-lg font-bold ${
                    isRight ? "bg-mint" : isWrong ? "bg-coral line-through opacity-70" : "bg-white hover:bg-sun"
                  }`}
                >
                  {o}
                  {isWrong && <span className="sr-only"> (wrong)</span>}
                  {isRight && <span className="sr-only"> (correct)</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {!solved && (
          <div className="mt-6">
            <h2 className="text-lg font-black">Hints ({hints}/3 used, each costs 15 points)</h2>
            <ol className="mt-2 space-y-2">
              {riddle.hints.slice(0, hints).map((h, i) => (
                <li key={i} className="animate-pop rounded-xl border-2 border-ink bg-white p-3 font-semibold">
                  <span className="font-black">Hint {i + 1}:</span> {h}
                </li>
              ))}
            </ol>
            {hints < 3 && (
              <div className="mt-3">
                <Button tone="white" onClick={() => setHints((h) => h + 1)}>
                  Show hint {hints + 1}
                </Button>
              </div>
            )}
          </div>
        )}

        {solved && (
          <div role="status" className="mt-6 animate-pop rounded-2xl border-2 border-ink bg-white p-4 font-semibold">
            <p className="text-xl font-black">Solved!</p>
            <p className="mt-1">{riddle.explain}</p>
            <div className="mt-4">
              <Button tone="sun" onClick={finish}>
                Collect my score
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
