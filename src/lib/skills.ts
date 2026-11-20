import type { Activity, Kind, Profile } from "./types";
import { KINDS } from "./types";

export const dayKey = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

export function totalXp(p: Profile): number {
  return p.activities.reduce((n, a) => n + a.xp, 0);
}

export function levelInfo(xp: number) {
  // Level n starts at 40 * (n-1)^2 XP, so early levels come quickly.
  const level = Math.floor(Math.sqrt(xp / 40)) + 1;
  const floor = 40 * (level - 1) ** 2;
  const ceil = 40 * level ** 2;
  return { level, into: xp - floor, span: ceil - floor, pct: (xp - floor) / (ceil - floor) };
}

export function streak(activities: Activity[], now = new Date()): number {
  const days = new Set(activities.map((a) => dayKey(a.at)));
  let count = 0;
  const cursor = new Date(now);
  // If nothing yet today, the streak can still be alive from yesterday.
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function minutesOn(activities: Activity[], day: string): number {
  return Math.round(
    activities.filter((a) => dayKey(a.at) === day).reduce((n, a) => n + a.seconds, 0) / 60,
  );
}

export function todayKinds(activities: Activity[], now = new Date()): Set<Kind> {
  const today = dayKey(now);
  return new Set(activities.filter((a) => dayKey(a.at) === today).map((a) => a.kind));
}

export function lastDays(n: number, now = new Date()): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push({
      key: dayKey(d),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return out;
}

export interface SkillSummary {
  kind: Kind;
  sessions: number;
  /** Average of the last 8 scores, or null if none. */
  level: number | null;
  /** Change vs the 8 sessions before that. Null if not enough data. */
  trend: number | null;
  minutes: number;
}

export function skillSummary(activities: Activity[], kind: Kind): SkillSummary {
  const mine = activities.filter((a) => a.kind === kind);
  const recent = mine.slice(-8);
  const before = mine.slice(-16, -8);
  const avg = (xs: Activity[]) =>
    xs.length ? Math.round(xs.reduce((n, a) => n + a.score, 0) / xs.length) : null;
  const r = avg(recent);
  const b = avg(before);
  return {
    kind,
    sessions: mine.length,
    level: r,
    trend: r !== null && b !== null ? r - b : null,
    minutes: Math.round(mine.reduce((n, a) => n + a.seconds, 0) / 60),
  };
}

export function allSkills(activities: Activity[]): SkillSummary[] {
  return KINDS.map((k) => skillSummary(activities, k));
}

export function bestScore(activities: Activity[], game: string): number | null {
  const s = activities.filter((a) => a.game === game).map((a) => a.score);
  return s.length ? Math.max(...s) : null;
}

export function done(activities: Activity[], key: string): boolean {
  return activities.some((a) => a.meta?.key === key);
}

/** Average reading speed in words per minute over recent passages. */
export function readingSpeed(activities: Activity[]): number | null {
  const w = activities
    .filter((a) => a.game === "passage" && typeof a.meta?.wpm === "number")
    .slice(-6)
    .map((a) => a.meta!.wpm as number);
  return w.length ? Math.round(w.reduce((n, x) => n + x, 0) / w.length) : null;
}

export function recommendation(activities: Activity[]): { kind: Kind; text: string } {
  const skills = allSkills(activities);
  const untouched = skills.find((s) => s.sessions === 0);
  if (untouched) {
    return {
      kind: untouched.kind,
      text: `Try a first ${untouched.kind === "problem" ? "thinking" : untouched.kind} activity to get a starting point.`,
    };
  }
  const lowest = [...skills].sort((a, b) => (a.level ?? 0) - (b.level ?? 0))[0];
  const name = lowest.kind === "problem" ? "problem-solving" : lowest.kind;
  return {
    kind: lowest.kind,
    text: `${name[0].toUpperCase()}${name.slice(1)} has the most room to grow. Two short sessions this week would help.`,
  };
}
