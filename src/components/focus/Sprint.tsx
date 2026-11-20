"use client";

import { useEffect, useRef, useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { Button, Panel } from "@/components/ui";
import type { RecordInput } from "@/lib/store";
import { fmtTime } from "@/lib/speech";

const LENGTHS = [2, 5, 10, 15, 25];

type Phase = "setup" | "run" | "over";

export function Sprint() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [minutes, setMinutes] = useState(5);
  const [task, setTask] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [lapses, setLapses] = useState(0);
  const [input, setInput] = useState<RecordInput | null>(null);
  const deadline = useRef(0);
  const startedAt = useRef(0);
  const lapsesRef = useRef(0);

  function start() {
    startedAt.current = Date.now();
    deadline.current = Date.now() + minutes * 60_000;
    lapsesRef.current = 0;
    setLapses(0);
    setRemaining(minutes * 60);
    setPhase("run");
  }

  function addLapse() {
    lapsesRef.current += 1;
    setLapses(lapsesRef.current);
  }

  function finish(completedFully: boolean) {
    const spent = Math.max(1, (Date.now() - startedAt.current) / 1000);
    const planned = minutes * 60;
    const fraction = completedFully ? 1 : Math.min(1, spent / planned);
    const score = Math.max(0, fraction * 100 - lapsesRef.current * 10);
    setInput({
      kind: "focus",
      game: "sprint",
      title: task.trim() ? `Focus Sprint: ${task.trim().slice(0, 40)}` : "Focus Sprint",
      score: completedFully ? score : Math.min(score, 60),
      seconds: spent,
      meta: { planned: minutes, lapses: lapsesRef.current, completed: completedFully ? 1 : 0 },
    });
    setPhase("over");
  }

  useEffect(() => {
    if (phase !== "run") return;
    const tick = setInterval(() => {
      const r = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(r);
      if (r <= 0) {
        clearInterval(tick);
        finish(true);
      }
    }, 500);
    // Leaving the tab counts as a lapse when the child comes back.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        lapsesRef.current += 1;
        setLapses(lapsesRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "over" && input) {
    const lap = Number(input.meta?.lapses);
    return (
      <ResultCard
        input={input}
        again={() => {
          setInput(null);
          setPhase("setup");
        }}
        backHref="/focus"
        backLabel="Back to focus"
        details={
          <p>
            You focused for <strong>{Math.max(1, Math.round(input.seconds / 60))} minute(s)</strong> and noticed{" "}
            <strong>{lap}</strong> lapse{lap === 1 ? "" : "s"}. Noticing a lapse and coming back is the skill you are
            training.
          </p>
        }
      />
    );
  }

  if (phase === "setup") {
    return (
      <Panel tone="mint-tint" className="mx-auto max-w-xl">
        <h2 className="text-2xl font-black">Set up your sprint</h2>
        <p className="mt-1 font-semibold text-ink-soft">
          Pick one task and work on only that until the timer ends. Leaving this tab counts as a lapse, and you can
          also tap the button yourself whenever your mind wanders.
        </p>

        <label className="mt-5 block">
          <span className="font-extrabold">What will you work on?</span>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            maxLength={60}
            placeholder="For example: maths homework, reading chapter 4"
            className="mt-1 w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-lg font-semibold"
          />
        </label>

        <fieldset className="mt-5">
          <legend className="font-extrabold">How long?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {LENGTHS.map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-full border-2 border-ink px-4 py-2 font-extrabold ${
                  minutes === m ? "bg-mint" : "bg-white hover:bg-mint-tint"
                }`}
              >
                <input
                  type="radio"
                  name="len"
                  value={m}
                  checked={minutes === m}
                  onChange={() => setMinutes(m)}
                  className="sr-only"
                />
                {m} min
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <Button tone="mint" onClick={start}>
            Begin sprint
          </Button>
        </div>
      </Panel>
    );
  }

  const total = minutes * 60;
  const pct = ((total - remaining) / total) * 100;

  return (
    <Panel tone="mint-tint" className="mx-auto max-w-xl text-center">
      <p className="font-extrabold text-ink-soft">{task.trim() || "Focus time"}</p>

      <div className="relative mx-auto mt-4 grid h-64 w-64 place-items-center">
        <div aria-hidden className="absolute inset-0 animate-breathe rounded-full border-[3px] border-ink bg-mint" />
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(var(--color-ink) ${pct}%, transparent 0)`,
            opacity: 0.1,
            maskImage: "radial-gradient(circle, transparent 58%, black 60%)",
          }}
        />
        <p className="relative text-6xl font-black tabular-nums" role="timer" aria-label={`${fmtTime(remaining)} left`}>
          {fmtTime(remaining)}
        </p>
      </div>

      <p className="font-bold text-ink-soft">Breathe in as the circle grows, out as it shrinks.</p>
      <p className="mt-2 font-extrabold" aria-live="polite">
        Lapses so far: {lapses}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button tone="white" onClick={addLapse}>
          My mind wandered
        </Button>
        <Button tone="white" onClick={() => finish(false)}>
          Stop early
        </Button>
      </div>
    </Panel>
  );
}
