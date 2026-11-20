export type WritingType = "Story" | "Describe" | "Explain" | "Opinion";

export interface WritingPrompt {
  id: string;
  type: WritingType;
  title: string;
  prompt: string;
  /** Planning questions answered before drafting. */
  plan: string[];
  /** Target word range. */
  min: number;
  max: number;
  /** Craft checklist the writer ticks off after drafting. */
  craft: string[];
}

const STORY_CRAFT = [
  "My opening line makes the reader want to keep going",
  "There is a problem the character has to face",
  "I used at least three sensory details (sight, sound, smell, touch, taste)",
  "My ending shows how the character changed or what they learned",
];
const DESCRIBE_CRAFT = [
  "I showed the place or person with specific details, not just \"nice\" or \"big\"",
  "I used at least two comparisons (like a simile)",
  "My details are in an order that makes sense",
  "My last sentence leaves the reader with one strong feeling",
];
const EXPLAIN_CRAFT = [
  "My first sentence says clearly what I am explaining",
  "I explained the steps or reasons in a sensible order",
  "I gave at least one example",
  "My ending sums up the most important point",
];
const OPINION_CRAFT = [
  "My opinion is stated clearly near the start",
  "I gave at least two reasons",
  "Each reason has an example or a fact",
  "I thought about one opposite view and answered it",
];

export const writingPrompts: WritingPrompt[] = [
  {
    id: "door-in-the-wall",
    type: "Story",
    title: "The Door That Was Not There Yesterday",
    prompt:
      "You wake up and find a small door in your bedroom wall that was not there before. Write the story of what happens when you open it.",
    plan: ["Who is the main character, and what do they want?", "What is behind the door?", "What problem appears?", "How does it end?"],
    min: 120,
    max: 300,
    craft: STORY_CRAFT,
  },
  {
    id: "last-bus",
    type: "Story",
    title: "The Last Bus Home",
    prompt:
      "The last bus of the night breaks down in the middle of nowhere. The passengers are strangers. Write a story about how they solve it together.",
    plan: ["Who are two of the passengers?", "What goes wrong?", "Whose idea saves the day?", "What do they feel at the end?"],
    min: 120,
    max: 300,
    craft: STORY_CRAFT,
  },
  {
    id: "favourite-place",
    type: "Describe",
    title: "A Place I Know by Heart",
    prompt:
      "Describe a place you know very well so that someone who has never been there can picture it, hear it and smell it.",
    plan: ["What is the place?", "What do you see first?", "What sounds and smells belong to it?", "How does it make you feel?"],
    min: 100,
    max: 250,
    craft: DESCRIBE_CRAFT,
  },
  {
    id: "market-day",
    type: "Describe",
    title: "Market Day",
    prompt:
      "Describe a busy market, street or playground at its noisiest moment. Make the reader feel they are standing in the middle of it.",
    plan: ["Where are you standing?", "What are three things you can hear?", "What colours stand out?", "What is one small detail most people miss?"],
    min: 100,
    max: 250,
    craft: DESCRIBE_CRAFT,
  },
  {
    id: "teach-a-skill",
    type: "Explain",
    title: "Teach Me Something",
    prompt:
      "Choose something you are good at, such as a game, a recipe, a sport or a trick. Explain it so clearly that a beginner could do it after reading.",
    plan: ["What will you teach?", "What does a beginner need first?", "What are the main steps?", "What is the most common mistake?"],
    min: 120,
    max: 280,
    craft: EXPLAIN_CRAFT,
  },
  {
    id: "why-sleep",
    type: "Explain",
    title: "Why Do We Need Sleep?",
    prompt:
      "Explain to a younger child why sleep matters. Use examples they will understand.",
    plan: ["What happens to you when you do not sleep?", "What does sleep help your body or brain do?", "What is one example from daily life?", "What is one tip for sleeping better?"],
    min: 100,
    max: 250,
    craft: EXPLAIN_CRAFT,
  },
  {
    id: "homework-debate",
    type: "Opinion",
    title: "Should Schools Have Shorter Homework?",
    prompt:
      "Some people think children should have less homework so they have time to play, rest and learn in other ways. Others think homework builds good habits. What do you think, and why?",
    plan: ["What is your opinion in one sentence?", "What is your strongest reason?", "What example or fact supports it?", "What would someone who disagrees say?"],
    min: 120,
    max: 300,
    craft: OPINION_CRAFT,
  },
  {
    id: "screen-time",
    type: "Opinion",
    title: "Is Screen Time a Problem?",
    prompt:
      "Write to your community about whether children spend too much time on screens. Take a clear position and defend it.",
    plan: ["What is your position?", "What are two reasons?", "What proof or example can you offer?", "How would you answer someone who disagrees?"],
    min: 120,
    max: 300,
    craft: OPINION_CRAFT,
  },
];

export const getPrompt = (id: string) => writingPrompts.find((p) => p.id === id);

export interface SpellingWord {
  word: string;
  meaning: string;
  sentence: string;
  tip?: string;
}

export const spellingWords: SpellingWord[] = [
  { word: "necessary", meaning: "needed", sentence: "It is necessary to wear a helmet when you ride.", tip: "One collar, two sleeves: 1 c, 2 s." },
  { word: "separate", meaning: "apart from each other", sentence: "Please keep the paints separate from the glue.", tip: "There is \"a rat\" in sep-a-rat-e." },
  { word: "definitely", meaning: "without any doubt", sentence: "I will definitely finish my book tonight.", tip: "It has \"finite\" inside it." },
  { word: "environment", meaning: "the natural world around us", sentence: "We planted trees to help the environment.", tip: "Remember the \"n\" before the \"m\"." },
  { word: "government", meaning: "the group that runs a country", sentence: "The government built a new bridge.", tip: "Do not skip the \"n\" in govern." },
  { word: "rhythm", meaning: "a regular pattern of beats", sentence: "The drummer kept a steady rhythm.", tip: "Rhythm Helps Your Two Hips Move." },
  { word: "library", meaning: "a place where books are kept", sentence: "We borrowed three books from the library.", tip: "Say it slowly: li-brar-y." },
  { word: "February", meaning: "the second month of the year", sentence: "My birthday is in February.", tip: "Pronounce the first \"r\": Feb-roo-ary." },
  { word: "embarrass", meaning: "to make someone feel awkward", sentence: "Please do not embarrass me in front of my friends.", tip: "Two r's and two s's." },
  { word: "receive", meaning: "to get something", sentence: "I hope to receive a letter from my cousin.", tip: "I before E except after C." },
  { word: "conscience", meaning: "your inner sense of right and wrong", sentence: "His conscience told him to return the wallet.", tip: "It has \"science\" inside." },
  { word: "privilege", meaning: "a special right or chance", sentence: "It was a privilege to meet the astronaut.", tip: "Three i's: priv-i-leg-e." },
  { word: "occasion", meaning: "a particular time or event", sentence: "The wedding was a happy occasion.", tip: "Two c's, one s." },
  { word: "calendar", meaning: "a chart showing days and months", sentence: "Mark the date on the calendar.", tip: "It ends in \"-ar\", not \"-er\"." },
  { word: "tomorrow", meaning: "the day after today", sentence: "We have a spelling test tomorrow.", tip: "One m, two r's." },
  { word: "Wednesday", meaning: "the day after Tuesday", sentence: "Choir practice is on Wednesday.", tip: "Say it as Wed-nes-day." },
  { word: "knowledge", meaning: "what you know and understand", sentence: "Reading builds knowledge.", tip: "Know + ledge." },
  { word: "vocabulary", meaning: "all the words you know", sentence: "Reading widens your vocabulary.", tip: "It ends in \"-ary\"." },
  { word: "beginning", meaning: "the start of something", sentence: "The beginning of the story was exciting.", tip: "Double the n before -ing." },
  { word: "achieve", meaning: "to succeed in doing something", sentence: "You can achieve a lot with practice.", tip: "I before E." },
  { word: "argument", meaning: "a disagreement, or a set of reasons", sentence: "She made a strong argument for recycling.", tip: "Drop the \"e\" from argue." },
  { word: "favourite", meaning: "liked best", sentence: "Blue is my favourite colour.", tip: "UK spelling has a \"u\"." },
  { word: "immediately", meaning: "right away", sentence: "Please come immediately.", tip: "Immediate + ly." },
  { word: "mischievous", meaning: "playfully naughty", sentence: "The mischievous puppy hid my shoe.", tip: "Only three syllables: mis-chiev-ous." },
  { word: "neighbour", meaning: "a person who lives near you", sentence: "Our neighbour waters our plants.", tip: "Eigh, like in weigh." },
  { word: "pronunciation", meaning: "the way a word is said", sentence: "Her pronunciation of French was excellent.", tip: "Not pro-NOUN-ciation: there is no \"ou\"." },
  { word: "restaurant", meaning: "a place to eat a meal out", sentence: "We ate dinner at a small restaurant.", tip: "Rest + au + rant." },
  { word: "thorough", meaning: "complete and careful", sentence: "She did a thorough check of her work.", tip: "Thor + ough." },
  { word: "unusual", meaning: "not common", sentence: "A snowy day here is unusual.", tip: "Un + usual." },
  { word: "guarantee", meaning: "a firm promise", sentence: "The shop gave a one-year guarantee.", tip: "The \"u\" keeps the g hard." },
];
