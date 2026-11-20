import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Kind } from "@/lib/types";
import { KIND_META } from "@/lib/types";

type Tone = "ink" | "grape" | "coral" | "mint" | "sun" | "white";

const toneClass: Record<Tone, string> = {
  ink: "bg-ink text-white",
  grape: "bg-grape text-white",
  coral: "bg-coral text-ink",
  mint: "bg-mint text-ink",
  sun: "bg-sun text-ink",
  white: "bg-white text-ink",
};

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full border-[2.5px] border-ink px-6 py-3 text-base font-extrabold shadow-sticker-sm transition-[transform,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] active:shadow-sticker-pressed disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0";

export function Button({
  tone = "ink",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return <button {...props} className={`${btnBase} ${toneClass[tone]} ${className}`} />;
}

export function LinkButton({
  href,
  tone = "ink",
  className = "",
  children,
}: {
  href: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${btnBase} ${toneClass[tone]} ${className}`}>
      {children}
    </Link>
  );
}

export function Panel({
  children,
  className = "",
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone | "grape-tint" | "coral-tint" | "mint-tint" | "sun-tint";
}) {
  const bg =
    tone in toneClass
      ? toneClass[tone as Tone]
      : { "grape-tint": "bg-grape-tint", "coral-tint": "bg-coral-tint", "mint-tint": "bg-mint-tint", "sun-tint": "bg-sun-tint" }[
          tone as string
        ];
  return (
    <div className={`sticker rounded-[22px] p-5 sm:p-6 ${bg} ${className}`}>{children}</div>
  );
}

export function Meter({
  value,
  tone = "grape",
  label,
}: {
  value: number;
  tone?: "grape" | "coral" | "mint" | "sun";
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const bg = { grape: "bg-grape", coral: "bg-coral", mint: "bg-mint", sun: "bg-sun" }[tone];
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-4 w-full overflow-hidden rounded-full border-2 border-ink bg-white"
    >
      <div className={`h-full ${bg} transition-[width] duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function KindBadge({ kind }: { kind: Kind }) {
  const m = KIND_META[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-sm font-extrabold ${m.tint}`}
    >
      <span aria-hidden>{m.emoji}</span>
      {m.label}
    </span>
  );
}

export function PageHeader({
  kind,
  title,
  intro,
  back,
}: {
  kind?: Kind;
  title: string;
  intro?: string;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-block text-sm font-extrabold text-ink-soft underline decoration-2 underline-offset-4 hover:text-ink">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">{title}</h1>
        {kind && <KindBadge kind={kind} />}
      </div>
      {intro && <p className="mt-3 max-w-[60ch] text-lg font-semibold text-ink-soft">{intro}</p>}
    </header>
  );
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-white px-4 py-3">
      <div className="text-2xl font-black leading-none">{value}</div>
      <div className="mt-1 text-sm font-bold text-ink-soft">{label}</div>
    </div>
  );
}
