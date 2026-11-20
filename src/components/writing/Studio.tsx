"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProfileGate } from "@/components/ProfileGate";
import { ResultCard } from "@/components/ResultCard";
import { Button, Meter, Panel } from "@/components/ui";
import { getPrompt } from "@/lib/content/writing";
import type { RecordInput } from "@/lib/store";
import { countWords, nowMs } from "@/lib/speech";
import { analyse } from "@/lib/writingCheck";

type Phase = "plan" | "draft" | "revise" | "done";
const STEPS: { id: Phase; label: string }[] = [
  { id: "plan", label: "Plan" },
  { id: "draft", label: "Draft" },
  { id: "revise", label: "Polish" },
];

function loadDraft(key: string): { plan: string[]; text: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const d = JSON.parse(raw) as { plan: string[]; text: string };
    return d && typeof d.text === "string" && d.text ? d : null;
  } catch {
    return null;
  }
}

export function Studio({ id }: { id: string }) {
  return <ProfileGate>{(p) => <StudioInner id={id} profileId={p.id} />}</ProfileGate>;
}

function StudioInner({ id, profileId }: { id: string; profileId: string }) {
  const prompt = getPrompt(id)!;
  const draftKey = `brightmind:draft:${profileId}:${id}`;

  // Restore an unfinished draft. This component only mounts on the client, after profiles load.
  const [saved] = useState(() => loadDraft(draftKey));
  const [phase, setPhase] = useState<Phase>(saved ? "draft" : "plan");
  const [plan, setPlan] = useState<string[]>(() =>
    saved && saved.plan.length === prompt.plan.length ? saved.plan : prompt.plan.map(() => ""),
  );
  const [text, setText] = useState(saved?.text ?? "");
  const [ticked, setTicked] = useState<boolean[]>(() => prompt.craft.map(() => false));
  const [input, setInput] = useState<RecordInput | null>(null);
  const started = useRef(0);

  useEffect(() => {
    started.current = nowMs();
  }, []);

  // Autosave.
  useEffect(() => {
    if (phase === "done") return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(draftKey, JSON.stringify({ plan, text }));
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [plan, text, phase, draftKey]);

  const words = countWords(text);
  const analysis = useMemo(() => analyse(text), [text]);
  const planDone = plan.filter((p) => p.trim().length > 2).length;

  function submit() {
    const lengthScore =
      words >= prompt.min
        ? words <= prompt.max * 1.3
          ? 1
          : 0.8
        : Math.max(0, words / prompt.min);
    const craft = ticked.filter(Boolean).length / ticked.length;
    const score = lengthScore * 40 + craft * 40 + analysis.mechanics * 20;
    try {
      window.localStorage.removeItem(draftKey);
    } catch {}
    setInput({
      kind: "writing",
      game: "composition",
      title: prompt.title,
      score,
      seconds: Math.max(30, Math.round((nowMs() - started.current) / 1000)),
      meta: { key: `write:${id}`, words },
    });
    setPhase("done");
  }

  if (phase === "done" && input) {
    return (
      <ResultCard
        input={input}
        backHref="/write"
        backLabel="Choose another prompt"
        details={
          <p>
            You wrote <strong>{words} words</strong>. The score looks at length, your craft checklist and the
            readability checks. It cannot judge how good your ideas are, so read your piece aloud to someone.
          </p>
        }
      />
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.id === phase);
  const inRange = words >= prompt.min && words <= prompt.max;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-extrabold text-ink-soft">{prompt.type}</p>
      <h1 className="text-4xl font-black leading-tight">{prompt.title}</h1>
      <p className="mt-3 text-lg font-semibold">{prompt.prompt}</p>

      <ol className="mt-6 flex gap-2" aria-label="Writing steps">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            aria-current={i === stepIndex ? "step" : undefined}
            className={`flex-1 rounded-full border-2 border-ink px-4 py-1.5 text-center text-sm font-extrabold ${
              i === stepIndex ? "bg-coral" : i < stepIndex ? "bg-mint" : "bg-white"
            }`}
          >
            {s.label}
          </li>
        ))}
      </ol>

      {phase === "plan" && (
        <Panel className="mt-6" tone="coral-tint">
          <h2 className="text-2xl font-black">Plan before you write</h2>
          <p className="mt-1 font-semibold text-ink-soft">Short notes are fine. Good writers always plan first.</p>
          <div className="mt-5 space-y-4">
            {prompt.plan.map((q, i) => (
              <label key={q} className="block">
                <span className="font-extrabold">{q}</span>
                <textarea
                  value={plan[i]}
                  onChange={(e) => setPlan((p) => p.map((v, j) => (j === i ? e.target.value : v)))}
                  rows={2}
                  className="mt-1 w-full rounded-xl border-2 border-ink bg-white p-3 text-lg font-semibold"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-4">
            <Button tone="coral" onClick={() => setPhase("draft")} disabled={planDone < 2}>
              Start writing
            </Button>
            {planDone < 2 && <span className="text-sm font-bold text-ink-soft">Answer at least two questions first.</span>}
          </div>
        </Panel>
      )}

      {phase === "draft" && (
        <div className="mt-6 grid gap-6">
          <Panel>
            <label htmlFor="draft" className="text-xl font-black">
              Your draft
            </label>
            <textarea
              id="draft"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={14}
              spellCheck
              className="reading-text mt-3 w-full rounded-xl border-2 border-ink bg-white p-4"
              placeholder="Start writing here…"
            />
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span
                className={`rounded-full border-2 border-ink px-3 py-1 font-extrabold ${inRange ? "bg-mint" : "bg-white"}`}
                aria-live="polite"
              >
                {words} words · aim for {prompt.min} to {prompt.max}
              </span>
              <Button tone="white" onClick={() => setPhase("plan")}>
                Back to plan
              </Button>
              <Button tone="coral" onClick={() => setPhase("revise")} disabled={words < 20}>
                Polish my draft
              </Button>
            </div>
            <div className="mt-3">
              <Meter value={Math.min(100, (words / prompt.min) * 100)} tone="coral" label="Progress to target length" />
            </div>
          </Panel>
          <details className="rounded-2xl border-2 border-ink bg-white p-4">
            <summary className="cursor-pointer font-extrabold">Show my plan</summary>
            <ul className="mt-2 space-y-1 font-semibold">
              {prompt.plan.map((q, i) => (
                <li key={q}>
                  <span className="text-ink-soft">{q}</span> {plan[i] || "—"}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}

      {phase === "revise" && (
        <div className="mt-6 grid gap-6">
          <Panel>
            <h2 className="text-2xl font-black">Polish check</h2>
            <p className="mt-1 font-semibold text-ink-soft">
              {analysis.words} words in {analysis.sentences} sentences. Fix anything marked, then send your piece in.
            </p>
            <ul className="mt-4 space-y-2">
              {analysis.checks.map((c) => (
                <li
                  key={c.label}
                  className={`flex gap-3 rounded-xl border-2 border-ink p-3 ${c.ok ? "bg-mint-tint" : "bg-sun-tint"}`}
                >
                  <span aria-hidden className="text-xl">
                    {c.ok ? "✅" : "🔧"}
                  </span>
                  <span>
                    <span className="font-extrabold">{c.label}</span>
                    <span className="block font-semibold text-ink-soft">
                      <span className="sr-only">{c.ok ? "Passed. " : "Needs work. "}</span>
                      {c.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel tone="coral-tint">
            <h2 className="text-2xl font-black">Your craft checklist</h2>
            <p className="mt-1 font-semibold text-ink-soft">Tick only what is honestly true of your writing.</p>
            <ul className="mt-4 space-y-2">
              {prompt.craft.map((c, i) => (
                <li key={c}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-ink bg-white p-3 font-bold">
                    <input
                      type="checkbox"
                      checked={ticked[i]}
                      onChange={() => setTicked((t) => t.map((v, j) => (j === i ? !v : v)))}
                      className="mt-1 h-5 w-5 accent-coral"
                    />
                    {c}
                  </label>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="flex flex-wrap gap-3">
            <Button tone="white" onClick={() => setPhase("draft")}>
              Edit my draft
            </Button>
            <Button tone="coral" onClick={submit}>
              Send it in
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
