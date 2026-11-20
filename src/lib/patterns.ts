import { pick, randInt, shuffle } from "./speech";

export interface PatternQuestion {
  shown: (number | string)[];
  answer: number | string;
  options: (number | string)[];
  rule: string;
  level: number;
}

type Gen = () => { seq: number[]; next: number; rule: string };

const arithmetic: Gen = () => {
  const start = randInt(1, 20);
  const step = randInt(2, 9);
  const seq = Array.from({ length: 5 }, (_, i) => start + i * step);
  return { seq: seq.slice(0, 4), next: seq[4], rule: `Add ${step} each time.` };
};

const decreasing: Gen = () => {
  const step = randInt(3, 9);
  const start = randInt(40, 80);
  const seq = Array.from({ length: 5 }, (_, i) => start - i * step);
  return { seq: seq.slice(0, 4), next: seq[4], rule: `Subtract ${step} each time.` };
};

const geometric: Gen = () => {
  const start = randInt(1, 4);
  const mult = pick([2, 3]);
  const seq = Array.from({ length: 5 }, (_, i) => start * mult ** i);
  return { seq: seq.slice(0, 4), next: seq[4], rule: `Multiply by ${mult} each time.` };
};

const growing: Gen = () => {
  const start = randInt(1, 10);
  const seq = [start];
  for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + i + 1);
  return { seq: seq.slice(0, 4), next: seq[4], rule: "The amount added grows by 1 each time (+2, +3, +4, +5)." };
};

const squares: Gen = () => {
  const o = randInt(1, 4);
  const seq = Array.from({ length: 5 }, (_, i) => (i + o) ** 2);
  return { seq: seq.slice(0, 4), next: seq[4], rule: "These are square numbers." };
};

const alternating: Gen = () => {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const start = randInt(12, 25);
  const seq = [start];
  for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + (i % 2 === 1 ? a : -b));
  return { seq: seq.slice(0, 5), next: seq[5], rule: `Add ${a}, then subtract ${b}, and repeat.` };
};

const fibLike: Gen = () => {
  const a = randInt(1, 5);
  const b = randInt(1, 5);
  const seq = [a, b];
  for (let i = 2; i < 7; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return { seq: seq.slice(0, 6), next: seq[6], rule: "Each number is the sum of the two before it." };
};

const interleaved: Gen = () => {
  const a = randInt(1, 5);
  const sa = randInt(2, 4);
  const b = randInt(20, 40);
  const sb = randInt(2, 5);
  const seq: number[] = [];
  for (let i = 0; i < 3; i++) {
    seq.push(a + i * sa);
    seq.push(b - i * sb);
  }
  const next = a + 3 * sa;
  return { seq, next, rule: `Two patterns take turns: one adds ${sa}, the other subtracts ${sb}.` };
};

const LEVELS: Gen[][] = [
  [arithmetic, decreasing],
  [geometric, growing, squares],
  [alternating, fibLike, interleaved],
];

/** level: 1 to 3 */
export function makePattern(level: number): PatternQuestion {
  const gens = LEVELS[Math.max(0, Math.min(2, level - 1))];
  const { seq, next, rule } = pick(gens)();
  const distractors = new Set<number>();
  const spread = Math.max(2, Math.round(Math.abs(next) * 0.15));
  let guard = 0;
  while (distractors.size < 3 && guard++ < 50) {
    const d = next + pick([-1, 1]) * randInt(1, spread + 3);
    if (d !== next && d > 0) distractors.add(d);
  }
  while (distractors.size < 3) distractors.add(next + distractors.size + 1);
  return {
    shown: seq,
    answer: next,
    options: shuffle([next, ...distractors]),
    rule,
    level,
  };
}
