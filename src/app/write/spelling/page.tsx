"use client";

import { useEffect, useRef, useState } from "react";
import { ProfileGate } from "@/components/ProfileGate";
import { ResultCard } from "@/components/ResultCard";
import { Button, Meter, PageHeader, Panel } from "@/components/ui";
import { spellingWords, type SpellingWord } from "@/lib/content/writing";
import type { RecordInput } from "@/lib/store";
import { canSpeak, shuffle, speak, stopSpeaking } from "@/lib/speech";

const ROUND = 10;

export default function SpellingPage() {
  return (
    <>
      <PageHeader
        kind="writing"
        title="Spelling Studio"
        back={{ href: "/write", label: "Writing" }}
        intro="Listen to the word and its sentence, then type it. Missed words come with a memory trick."
      />
      <ProfileGate>{() => <Round />}</ProfileGate>
    </>
  );
}

function Round() {
  const [run, setRun] = useState(0);
  return <Game key={run} onAgain={() => setRun((r) => r + 1)} />;
}

function Game({ onAgain }: { onAgain: () => void }) {
  const [words] = useState<SpellingWord[]>(() => shuffle(spellingWords).slice(0, ROUND));
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [state, setState] = useState<"ask" | "right" | "wrong">("ask");
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [input, setInput] = useState<RecordInput | null>(null);
  const started = useRef(0);
  const field = useRef<HTMLInputElement>(null);
  const w = words[i];

  useEffect(() => {
    started.current = Date.now();
    return () => stopSpeaking();
  }, []);

  function say(slow = false) {
    if (!w) return;
    void speak(`${w.word}. ${w.sentence}. ${w.word}.`, slow ? 0.7 : 0.9);
  }

  useEffect(() => {
    if (state === "ask" && w) {
      field.current?.focus();
      const t = setTimeout(() => say(), 250);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, state]);

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (state !== "ask") return;
    const ok = value.trim().toLowerCase() === w.word.toLowerCase();
    if (ok) setCorrect((c) => c + 1);
    else setMissed((m) => [...m, w.word]);
    setState(ok ? "right" : "wrong");
  }

  function next() {
    if (i + 1 < words.length) {
      setI(i + 1);
      setValue("");
      setState("ask");
      return;
    }
    setInput({
      kind: "writing",
      game: "spelling",
      title: "Spelling Studio",
      score: (correct / words.length) * 100,
      seconds: (Date.now() - started.current) / 1000,
      meta: { correct, total: words.length },
    });
  }

  if (input) {
    return (
      <ResultCard
        input={input}
        again={onAgain}
        backHref="/write"
        backLabel="Back to writing"
        details={
          <p>
            You spelled <strong>{correct}</strong> of <strong>{words.length}</strong> correctly.
            {missed.length > 0 && (
              <>
                {" "}
                Words to practise: <strong>{missed.join(", ")}</strong>.
              </>
            )}
          </p>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-extrabold">
          Word {i + 1} of {words.length}
        </span>
        <span className="font-extrabold">{correct} correct</span>
      </div>
      <Meter value={(i / words.length) * 100} tone="coral" label="Round progress" />

      <Panel className="mt-6" tone="coral-tint">
        <p className="text-sm font-extrabold text-ink-soft">Meaning: {w.meaning}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {canSpeak() ? (
            <>
              <Button tone="white" onClick={() => say(false)}>
                🔊 Hear it again
              </Button>
              <Button tone="white" onClick={() => say(true)}>
                🐢 Slowly
              </Button>
            </>
          ) : (
            <p className="rounded-xl border-2 border-ink bg-white p-3 font-bold">
              Audio is not available in this browser. Sentence: {w.sentence.replace(new RegExp(w.word, "i"), "_____")}
            </p>
          )}
        </div>

        <form onSubmit={check} className="mt-5">
          <label htmlFor="spell" className="font-extrabold">
            Type the word
          </label>
          <input
            id="spell"
            ref={field}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={state !== "ask"}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="mt-1 w-full rounded-xl border-[2.5px] border-ink bg-white px-4 py-3 text-2xl font-black tracking-wide"
          />
          {state === "ask" && (
            <div className="mt-4">
              <Button type="submit" tone="coral" disabled={!value.trim()}>
                Check
              </Button>
            </div>
          )}
        </form>

        {state !== "ask" && (
          <div role="status" className="mt-5 animate-pop rounded-2xl border-2 border-ink bg-white p-4">
            {state === "right" ? (
              <p className="text-xl font-black">Correct!</p>
            ) : (
              <>
                <p className="text-xl font-black">Not quite. The spelling is:</p>
                <p className="mt-1 text-3xl font-black tracking-wide">{w.word}</p>
                {w.tip && <p className="mt-2 font-bold text-ink-soft">Memory trick: {w.tip}</p>}
              </>
            )}
            <div className="mt-4">
              <Button tone="coral" onClick={next}>
                {i + 1 < words.length ? "Next word" : "Finish"}
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
