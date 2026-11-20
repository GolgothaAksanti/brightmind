"use client";

import { useEffect, useRef, useState } from "react";
import { ProfileGate } from "@/components/ProfileGate";
import { ResultCard } from "@/components/ResultCard";
import { Button, Meter, Panel } from "@/components/ui";
import { getPassage, type QType } from "@/lib/content/passages";
import type { RecordInput } from "@/lib/store";
import { canSpeak, countWords, speak, stopSpeaking } from "@/lib/speech";

type Phase = "read" | "quiz" | "done";

export function Reader({ id }: { id: string }) {
  return <ProfileGate>{() => <ReaderInner id={id} />}</ProfileGate>;
}

function ReaderInner({ id }: { id: string }) {
  const passage = getPassage(id)!;
  const words = passage.paragraphs.reduce((n, p) => n + countWords(p), 0);

  const [phase, setPhase] = useState<Phase>("read");
  const [readSeconds, setReadSeconds] = useState(0);
  const startedAt = useRef<number>(0);
  const [speaking, setSpeaking] = useState(false);

  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<{ type: QType; ok: boolean }[]>([]);
  const [peek, setPeek] = useState(false);
  const [input, setInput] = useState<RecordInput | null>(null);
  const quizStart = useRef<number>(0);

  useEffect(() => {
    startedAt.current = Date.now();
    return () => stopSpeaking();
  }, []);

  function finishReading() {
    stopSpeaking();
    setSpeaking(false);
    setReadSeconds(Math.max(5, Math.round((Date.now() - startedAt.current) / 1000)));
    quizStart.current = Date.now();
    setPhase("quiz");
  }

  async function readAloud() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    await speak(passage.paragraphs.join(" "), 0.95);
    setSpeaking(false);
  }

  const q = passage.questions[qi];

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    setResults((r) => [...r, { type: q.type, ok: i === q.answer }]);
  }

  function next() {
    if (qi + 1 < passage.questions.length) {
      setQi(qi + 1);
      setPicked(null);
      setPeek(false);
      return;
    }
    const correct = results.filter((r) => r.ok).length;
    const total = passage.questions.length;
    const wpm = Math.round(words / (readSeconds / 60));
    const quizSeconds = Math.round((Date.now() - quizStart.current) / 1000);
    setInput({
      kind: "reading",
      game: "passage",
      title: passage.title,
      score: (correct / total) * 100,
      seconds: readSeconds + quizSeconds,
      meta: { key: `passage:${id}`, wpm, correct, total },
    });
    setPhase("done");
  }

  if (phase === "done" && input) {
    const correct = Number(input.meta?.correct);
    const total = Number(input.meta?.total);
    const byType = new Map<QType, { ok: number; n: number }>();
    results.forEach((r) => {
      const cur = byType.get(r.type) ?? { ok: 0, n: 0 };
      byType.set(r.type, { ok: cur.ok + (r.ok ? 1 : 0), n: cur.n + 1 });
    });
    return (
      <ResultCard
        input={input}
        backHref="/read"
        backLabel="Pick another passage"
        details={
          <div className="space-y-3">
            <p>
              You answered <strong>{correct}</strong> of <strong>{total}</strong> correctly and read at about{" "}
              <strong>{String(input.meta?.wpm)} words per minute</strong>.
            </p>
            <ul className="grid gap-1.5 text-sm">
              {[...byType.entries()].map(([t, v]) => (
                <li key={t} className="flex justify-between rounded-lg border-2 border-ink bg-white px-3 py-1.5 font-bold capitalize">
                  <span>{t}</span>
                  <span>
                    {v.ok}/{v.n}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        }
      />
    );
  }

  const PassageText = (
    <article aria-label={passage.title} className="reading-text space-y-5">
      {passage.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </article>
  );

  if (phase === "read") {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              <span aria-hidden>{passage.emoji} </span>
              {passage.title}
            </h1>
          </div>
          <Panel className="!p-6 sm:!p-8">{PassageText}</Panel>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button tone="grape" onClick={finishReading}>
              I have finished reading
            </Button>
            {canSpeak() && (
              <Button tone="white" onClick={readAloud} aria-pressed={speaking}>
                {speaking ? "Stop reading aloud" : "Read it aloud to me"}
              </Button>
            )}
          </div>
          <p className="mt-3 max-w-[60ch] text-sm font-semibold text-ink-soft">
            Read at your own pace. Your reading speed is measured, but understanding matters most.
          </p>
        </div>
        <aside>
          <Panel tone="grape-tint">
            <h2 className="text-xl font-black">Word box</h2>
            <dl className="mt-3 space-y-3">
              {passage.vocab.map((v) => (
                <div key={v.word}>
                  <dt className="font-black">{v.word}</dt>
                  <dd className="text-sm font-semibold text-ink-soft">{v.meaning}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </aside>
      </div>
    );
  }

  const answered = picked !== null;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black">{passage.title}</h1>
        <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-extrabold">
          Question {qi + 1} of {passage.questions.length}
        </span>
      </div>
      <Meter value={(qi / passage.questions.length) * 100} tone="grape" label="Quiz progress" />

      <Panel className="mt-6">
        <p className="text-sm font-extrabold capitalize text-ink-soft">{q.type}</p>
        <h2 className="mt-1 text-2xl font-black leading-snug">{q.q}</h2>
        <ul className="mt-5 grid gap-3">
          {q.options.map((o, i) => {
            const isRight = i === q.answer;
            const isPicked = i === picked;
            let style = "bg-white hover:bg-grape-tint";
            if (answered && isRight) style = "bg-mint text-ink";
            else if (answered && isPicked) style = "bg-coral text-ink animate-shake";
            else if (answered) style = "bg-white opacity-60";
            return (
              <li key={i}>
                <button
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={`w-full rounded-2xl border-[2.5px] border-ink px-4 py-3 text-left text-lg font-bold transition-colors ${style}`}
                >
                  <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-white text-sm font-black text-ink">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {o}
                  {answered && isRight && <span className="sr-only"> (correct answer)</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div role="status" className="mt-5 animate-pop rounded-2xl border-2 border-ink bg-sun-tint p-4 font-semibold">
            <p className="font-black">{picked === q.answer ? "Correct." : "Not quite."}</p>
            <p>{q.why}</p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {answered && (
            <Button tone="grape" onClick={next}>
              {qi + 1 < passage.questions.length ? "Next question" : "See my results"}
            </Button>
          )}
          <Button tone="white" onClick={() => setPeek((v) => !v)} aria-expanded={peek}>
            {peek ? "Hide the passage" : "Look back at the passage"}
          </Button>
        </div>
      </Panel>

      {peek && <Panel className="mt-6 !p-6">{PassageText}</Panel>}
    </div>
  );
}
