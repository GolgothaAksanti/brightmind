import { countWords } from "./speech";

export interface Check {
  label: string;
  ok: boolean;
  detail: string;
}

export interface WritingAnalysis {
  words: number;
  sentences: number;
  avgSentence: number;
  checks: Check[];
  /** 0 to 1 */
  mechanics: number;
}

export function analyse(text: string): WritingAnalysis {
  const words = countWords(text);
  const sentences = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  const lowerStarts = sentences.filter((s) => /^[a-z]/.test(s)).length;
  const noEnd = sentences.filter((s) => !/[.!?"”')]$/.test(s)).length;
  const lengths = sentences.map((s) => countWords(s));
  const avg = lengths.length ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 0;
  const longest = lengths.length ? Math.max(...lengths) : 0;
  const tokens = (text.toLowerCase().match(/[a-z']+/g) ?? []).filter((w) => w.length > 3);
  const unique = tokens.length ? new Set(tokens).size / tokens.length : 0;

  const openers = sentences.map((s) => (s.split(" ")[0] ?? "").toLowerCase().replace(/[^a-z]/g, ""));
  const repeatedOpeners = openers.length > 3 ? openers.length - new Set(openers).size : 0;

  const checks: Check[] = [
    {
      label: "Every sentence starts with a capital letter",
      ok: lowerStarts === 0,
      detail: lowerStarts === 0 ? "Well done." : `${lowerStarts} sentence${lowerStarts > 1 ? "s start" : " starts"} with a small letter.`,
    },
    {
      label: "Every sentence ends with a full stop, question mark or exclamation mark",
      ok: noEnd === 0 && sentences.length > 0,
      detail: noEnd === 0 ? "Well done." : `${noEnd} sentence${noEnd > 1 ? "s are" : " is"} missing end punctuation.`,
    },
    {
      label: "Sentence lengths are comfortable to read",
      ok: avg >= 7 && avg <= 20 && longest <= 35,
      detail:
        longest > 35
          ? `Your longest sentence has ${longest} words. Try splitting it in two.`
          : avg < 7
            ? "Your sentences are very short. Join a few with and, but or because."
            : avg > 20
              ? "Your sentences are long on average. Add some short ones for punch."
              : `Average ${avg} words per sentence. Nice balance.`,
    },
    {
      label: "Word choice has variety",
      ok: unique >= 0.55,
      detail: unique >= 0.55 ? "You used a good range of words." : "Some words repeat a lot. Swap a few for stronger ones.",
    },
    {
      label: "Sentences begin in different ways",
      ok: repeatedOpeners <= Math.floor(sentences.length / 3),
      detail:
        repeatedOpeners <= Math.floor(sentences.length / 3)
          ? "Good variety in how sentences begin."
          : "Several sentences begin with the same word. Try a different opening for some.",
    },
  ];

  const mechanics = checks.filter((c) => c.ok).length / checks.length;
  return { words, sentences: sentences.length, avgSentence: avg, checks, mechanics };
}
