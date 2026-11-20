export type Kind = "reading" | "writing" | "focus" | "problem";

export const KINDS: Kind[] = ["reading", "writing", "focus", "problem"];

export const KIND_META: Record<
  Kind,
  { label: string; blurb: string; href: string; bg: string; tint: string; emoji: string }
> = {
  reading: {
    label: "Reading",
    blurb: "Stories, facts and word power",
    href: "/read",
    bg: "bg-grape",
    tint: "bg-grape-tint",
    emoji: "📖",
  },
  writing: {
    label: "Writing",
    blurb: "Plan, draft and polish",
    href: "/write",
    bg: "bg-coral",
    tint: "bg-coral-tint",
    emoji: "✏️",
  },
  focus: {
    label: "Focus",
    blurb: "Train your attention",
    href: "/focus",
    bg: "bg-mint",
    tint: "bg-mint-tint",
    emoji: "🎯",
  },
  problem: {
    label: "Thinking",
    blurb: "Puzzles, patterns and codes",
    href: "/think",
    bg: "bg-sun",
    tint: "bg-sun-tint",
    emoji: "🧩",
  },
};

export interface Activity {
  id: string;
  kind: Kind;
  /** Stable key for the activity type, e.g. "passage", "sequence", "patterns". */
  game: string;
  title: string;
  /** 0 to 100 */
  score: number;
  xp: number;
  seconds: number;
  at: string; // ISO timestamp
  meta?: Record<string, number | string>;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  dailyGoalMin: number;
  activities: Activity[];
}

export interface State {
  v: 1;
  profiles: Profile[];
  activeId: string | null;
  pin: string | null;
}

export const AVATARS = ["🦊", "🐙", "🦉", "🐼", "🦖", "🐬", "🚀", "🦄", "🐯", "🐸", "🤖", "🌟"];
