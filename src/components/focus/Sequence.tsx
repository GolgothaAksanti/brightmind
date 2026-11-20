"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { Button, Panel } from "@/components/ui";
import type { RecordInput } from "@/lib/store";
import { nowMs, randInt } from "@/lib/speech";

type Mode = "idle" | "watch" | "repeat" | "over";

const MAX_LEVEL = 10;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function Sequence() {
  const [level, setLevel] = useState(1);
  const [cleared, setCleared] = useState(0);
  const [lives, setLives] = useState(2);
  const [mode, setMode] = useState<Mode>("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [message, setMessage] = useState("Press start, watch the tiles light up, then repeat the order.");
  const [input, setInput] = useState<RecordInput | null>(null);

  const seq = useRef<number[]>([]);
  const step = useRef(0);
  const token = useRef(0);
  const started = useRef(0);

  const tiles = level >= 7 ? 16 : 9;
  const cols = level >= 7 ? 4 : 3;

  useEffect(() => {
    const t = token;
    return () => {
      t.current++;
    };
  }, []);

  const play = useCallback(async (s: number[]) => {
    const my = ++token.current;
    setMode("watch");
    setMessage("Watch closely…");
    await wait(700);
    for (const t of s) {
      if (token.current !== my) return;
      setLit(t);
      await wait(520);
      setLit(null);
      await wait(220);
    }
    if (token.current !== my) return;
    step.current = 0;
    setMode("repeat");
    setMessage("Your turn. Tap the tiles in the same order.");
  }, []);

  function newSequence(lv: number) {
    const n = lv >= 7 ? 16 : 9;
    const len = lv + 2;
    const s: number[] = [];
    for (let i = 0; i < len; i++) s.push(randInt(0, n - 1));
    seq.current = s;
    return s;
  }

  function start() {
    started.current = nowMs();
    setLives(2);
    setCleared(0);
    setLevel(1);
    setInput(null);
    void play(newSequence(1));
  }

  function finish(reached: number) {
    token.current++;
    setMode("over");
    setInput({
      kind: "focus",
      game: "sequence",
      title: "Memory Sequence",
      score: Math.min(100, (reached / MAX_LEVEL) * 100),
      seconds: (nowMs() - started.current) / 1000,
      meta: { level: reached },
    });
  }

  function tap(i: number) {
    if (mode !== "repeat") return;
    setLit(i);
    setTimeout(() => setLit(null), 160);

    if (i === seq.current[step.current]) {
      step.current++;
      if (step.current === seq.current.length) {
        const done = level;
        setCleared(done);
        if (done >= MAX_LEVEL) return finish(done);
        setMessage("Perfect! Get ready for a longer one.");
        setMode("watch");
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setTimeout(() => void play(newSequence(nextLevel)), 900);
      }
    } else {
      const left = lives - 1;
      setLives(left);
      if (left <= 0) return finish(cleared);
      setMessage("Not that one. Watch the same pattern again.");
      setMode("watch");
      setTimeout(() => void play(seq.current), 900);
    }
  }

  if (mode === "over" && input) {
    return (
      <ResultCard
        input={input}
        again={start}
        backHref="/focus"
        backLabel="Back to focus"
        details={
          <p>
            You cleared <strong>{cleared}</strong> level{cleared === 1 ? "" : "s"}, remembering up to{" "}
            <strong>{cleared + 2}</strong> tiles in order.
          </p>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full border-2 border-ink bg-white px-3 py-1 font-extrabold">Level {level}</span>
        <span className="font-extrabold" aria-label={`${lives} lives left`}>
          {"❤️".repeat(lives)}
          {"🤍".repeat(2 - lives)}
        </span>
      </div>

      <Panel tone="mint-tint">
        <div
          className="mx-auto grid max-w-sm gap-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          role="group"
          aria-label="Memory tiles"
        >
          {Array.from({ length: tiles }).map((_, i) => (
            <button
              key={i}
              onClick={() => tap(i)}
              disabled={mode !== "repeat"}
              aria-label={`Tile ${i + 1}`}
              className={`aspect-square rounded-2xl border-[2.5px] border-ink transition-colors duration-100 ${
                lit === i ? "scale-95 bg-sun shadow-none" : "bg-white shadow-sticker-sm"
              } ${mode === "repeat" ? "cursor-pointer hover:bg-mint-tint" : "cursor-default"}`}
            />
          ))}
        </div>
        <p role="status" className="mt-5 text-center text-lg font-extrabold">
          {message}
        </p>
        {mode === "idle" && (
          <div className="mt-4 text-center">
            <Button tone="mint" onClick={start}>
              Start
            </Button>
          </div>
        )}
      </Panel>
    </div>
  );
}
