"use client";

import { useSyncExternalStore } from "react";
import type { Activity, Kind, Profile, State } from "./types";

const KEY = "brightmind:v1";

const EMPTY: State = { v: 1, profiles: [], activeId: null, pin: null };

let lastRaw: string | null | undefined;
let lastState: State = EMPTY;
const listeners = new Set<() => void>();

function read(): State {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return lastState;
  }
  if (raw === lastRaw) return lastState;
  lastRaw = raw;
  if (!raw) {
    lastState = EMPTY;
    return lastState;
  }
  try {
    const parsed = JSON.parse(raw) as State;
    lastState = parsed && parsed.v === 1 ? parsed : EMPTY;
  } catch {
    lastState = EMPTY;
  }
  return lastState;
}

function write(next: State) {
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // Storage can be full or blocked. Keep working in memory for this session.
  }
  lastRaw = raw;
  lastState = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const active = state.profiles.find((p) => p.id === state.activeId) ?? null;
  return { state, ready, active };
}

export function useActiveProfile() {
  const { active, ready, state } = useStore();
  return { profile: active, ready, hasProfiles: state.profiles.length > 0 };
}

const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* ---------- actions ---------- */

export function createProfile(name: string, avatar: string): string {
  const s = read();
  const p: Profile = {
    id: uid(),
    name: name.trim().slice(0, 20),
    avatar,
    createdAt: new Date().toISOString(),
    dailyGoalMin: 20,
    activities: [],
  };
  write({ ...s, profiles: [...s.profiles, p], activeId: p.id });
  return p.id;
}

export function setActive(id: string | null) {
  const s = read();
  write({ ...s, activeId: id });
}

export function deleteProfile(id: string) {
  const s = read();
  const profiles = s.profiles.filter((p) => p.id !== id);
  write({
    ...s,
    profiles,
    activeId: s.activeId === id ? (profiles[0]?.id ?? null) : s.activeId,
  });
}

export function updateProfile(id: string, patch: Partial<Pick<Profile, "name" | "avatar" | "dailyGoalMin">>) {
  const s = read();
  write({
    ...s,
    profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  });
}

export function setPin(pin: string | null) {
  const s = read();
  write({ ...s, pin });
}

export function exportData(): string {
  return JSON.stringify(read(), null, 2);
}

export function xpFor(score: number, seconds: number): number {
  const base = Math.round(score * 0.5) + Math.round(seconds / 30);
  return Math.max(5, Math.min(80, base));
}

export interface RecordInput {
  kind: Kind;
  game: string;
  title: string;
  score: number;
  seconds: number;
  meta?: Record<string, number | string>;
}

/** Records a finished activity for the active profile. Returns it, or null if no profile. */
export function recordActivity(input: RecordInput): Activity | null {
  const s = read();
  const id = s.activeId;
  if (!id) return null;
  const score = Math.max(0, Math.min(100, Math.round(input.score)));
  const seconds = Math.max(1, Math.round(input.seconds));
  const activity: Activity = {
    id: uid(),
    kind: input.kind,
    game: input.game,
    title: input.title,
    score,
    seconds,
    xp: xpFor(score, seconds),
    at: new Date().toISOString(),
    meta: input.meta,
  };
  write({
    ...s,
    profiles: s.profiles.map((p) =>
      p.id === id ? { ...p, activities: [...p.activities, activity].slice(-1500) } : p,
    ),
  });
  return activity;
}
