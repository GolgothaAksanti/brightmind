export type QType = "detail" | "inference" | "vocabulary" | "main idea";

export interface Question {
  q: string;
  options: string[];
  answer: number;
  type: QType;
  why: string;
}

export interface Passage {
  id: string;
  title: string;
  genre: "Science" | "Story";
  level: 1 | 2 | 3;
  emoji: string;
  paragraphs: string[];
  vocab: { word: string; meaning: string }[];
  questions: Question[];
}

export const passages: Passage[] = [
  {
    id: "octopus-escape",
    title: "The Octopus Escape Artist",
    genre: "Science",
    level: 2,
    emoji: "🐙",
    paragraphs: [
      "In 2016, staff at an aquarium in New Zealand arrived one morning to find an empty tank. Inky, a common octopus, was gone. A trail of wet marks led across the floor to a narrow drain pipe, and the pipe led straight to the ocean. Inky had climbed out, slid through the opening, and dropped into the sea.",
      "The escape was not a surprise to people who study octopuses. An octopus has no bones, so its body can squeeze through any gap that is bigger than its hard beak. A creature the size of a football can pass through a hole the size of a coin.",
      "Octopuses are also remarkable thinkers. Roughly two thirds of their nerve cells are found in their arms, not in their head, so each arm can taste, touch and make small decisions on its own. In labs, octopuses have unscrewed jar lids to reach food and learned to find their way through simple mazes.",
      "Keeping an octopus in a tank is therefore a puzzle for humans. Aquarium workers use heavy lids, tight latches and covered drains. Even so, a curious octopus will keep testing every corner, patiently looking for the one weakness nobody noticed.",
    ],
    vocab: [
      { word: "remarkable", meaning: "worth noticing because it is unusual or impressive" },
      { word: "patiently", meaning: "calmly, without hurrying or giving up" },
      { word: "nerve cells", meaning: "tiny cells that carry messages around the body" },
    ],
    questions: [
      {
        q: "How did Inky leave the aquarium?",
        options: [
          "Staff carried Inky to the ocean",
          "Inky slipped through a drain pipe that led to the sea",
          "Inky broke the glass of the tank",
          "Inky was released as part of a study",
        ],
        answer: 1,
        type: "detail",
        why: "The first paragraph says the wet trail led to a drain pipe that went to the ocean.",
      },
      {
        q: "Why can an octopus fit through such small gaps?",
        options: [
          "It can shrink its beak",
          "It is very small when it is young",
          "It has no bones, so only its beak limits the size of the gap",
          "It uses its arms to widen the hole",
        ],
        answer: 2,
        type: "detail",
        why: "Without bones, the octopus can squeeze through anything bigger than its beak.",
      },
      {
        q: "What does the word \"remarkable\" mean in paragraph three?",
        options: ["Easy to forget", "Very noisy", "Impressive and worth noticing", "Scary"],
        answer: 2,
        type: "vocabulary",
        why: "The paragraph then lists impressive abilities, such as opening jars and solving mazes.",
      },
      {
        q: "What can you infer from the fact that most nerve cells are in an octopus's arms?",
        options: [
          "Its arms can act with some independence",
          "Its head is not important",
          "It cannot learn anything",
          "Its arms are stronger than its beak",
        ],
        answer: 0,
        type: "inference",
        why: "The text says each arm can taste, touch and make small decisions on its own.",
      },
      {
        q: "Which sentence states the main idea of the passage?",
        options: [
          "Aquariums should not keep animals.",
          "Octopuses are clever, flexible animals that are hard to keep contained.",
          "New Zealand has the best aquariums.",
          "Octopuses eat food from jars.",
        ],
        answer: 1,
        type: "main idea",
        why: "Every paragraph supports the idea of a clever, bendy animal that finds ways out.",
      },
    ],
  },
  {
    id: "red-sunsets",
    title: "Why Sunsets Turn Red",
    genre: "Science",
    level: 3,
    emoji: "🌅",
    paragraphs: [
      "Sunlight looks white, but it is really a mixture of every colour in the rainbow. Each colour travels as a wave, and the waves are different lengths. Red waves are long and lazy. Blue waves are short and quick.",
      "On the way to your eyes, sunlight crashes into the tiny gas molecules that make up the air. These molecules bounce short blue waves in every direction far more than they bounce long red waves. This bouncing is called scattering. At midday, scattered blue light reaches you from all over the sky, so the sky looks blue.",
      "At sunset, the Sun sits low on the horizon, and its light must travel through much more air before it reaches you. Along that long journey, nearly all the blue light is scattered away to other parts of the world. The light that is left over is rich in orange and red.",
      "Dust, smoke and tiny drops of water can make this effect even stronger. That is why the most dramatic sunsets often follow a dry, dusty day or a volcanic eruption. The sky is not changing colour. The light is simply losing some of its colours on the way.",
    ],
    vocab: [
      { word: "scattering", meaning: "bouncing in many directions" },
      { word: "horizon", meaning: "the line where the sky seems to meet the ground" },
      { word: "dramatic", meaning: "striking and full of impact" },
    ],
    questions: [
      {
        q: "According to the passage, why is the midday sky blue?",
        options: [
          "Blue light is the only light that reaches Earth",
          "Air scatters short blue waves in all directions",
          "The ocean reflects onto the sky",
          "Red light is blocked by clouds",
        ],
        answer: 1,
        type: "detail",
        why: "Paragraph two says molecules bounce blue waves about the sky, so blue arrives from everywhere.",
      },
      {
        q: "Why does sunset light look orange and red?",
        options: [
          "The Sun gets cooler in the evening",
          "The light passes through more air, and most blue is scattered away",
          "Dust adds red colour to the Sun",
          "Red waves are faster than blue waves",
        ],
        answer: 1,
        type: "detail",
        why: "The longer path through air removes the blue and leaves the warm colours.",
      },
      {
        q: "What does \"dramatic\" most likely mean in the last paragraph?",
        options: ["Boring", "Hard to see", "Striking and powerful", "Very cold"],
        answer: 2,
        type: "vocabulary",
        why: "It describes sunsets made stronger by dust and smoke.",
      },
      {
        q: "What can you infer about a sunset seen after a large volcanic eruption?",
        options: [
          "It would be paler than usual",
          "It would probably be unusually vivid",
          "It would be blue",
          "It would not happen",
        ],
        answer: 1,
        type: "inference",
        why: "Volcanic particles in the air increase the effect, so colours get stronger.",
      },
      {
        q: "What is the main idea of the passage?",
        options: [
          "Sunlight is only red and blue",
          "Scattering explains why the sky changes colour from noon to sunset",
          "Dust is bad for the Earth",
          "The Sun moves closer to Earth in the evening",
        ],
        answer: 1,
        type: "main idea",
        why: "The passage explains one process, scattering, and how it shapes both sky colours.",
      },
    ],
  },
  {
    id: "map-under-floorboards",
    title: "The Map Under the Floorboards",
    genre: "Story",
    level: 2,
    emoji: "🗺️",
    paragraphs: [
      "Amara had been told to stay out of the attic, but the rain was loud and the house was quiet, and curiosity won. Near the window, one floorboard sat a little higher than the rest. She pressed it with her thumb. It clicked, tilted, and revealed a hollow no bigger than a lunchbox.",
      "Inside lay a folded square of paper, soft as cloth from age. Amara spread it on the floor. It was a hand-drawn map of her own street, but the street was wrong. Where the bakery stood, someone had drawn a tall tree. Where the bus stop was, a little pond. In the corner, in careful capital letters, were the words: WHAT WAS HERE BEFORE.",
      "Her grandfather found her ten minutes later. She expected a scolding. Instead he lowered himself onto the floor, ran a finger along the paper, and smiled the way people smile at old friends. \"I drew this when I was your age,\" he said. \"The pond froze every winter. We skated until our noses went numb.\"",
      "Amara looked at the map, then out the window at the wet grey street. For the first time, she wondered what her own world looked like to someone who had known it differently. \"Will you teach me how to draw one?\" she asked. He laughed. \"Better. We'll draw what's here now, and in fifty years someone can find it.\"",
    ],
    vocab: [
      { word: "hollow", meaning: "an empty space inside something" },
      { word: "scolding", meaning: "an angry telling-off" },
      { word: "curiosity", meaning: "a strong wish to know or learn something" },
    ],
    questions: [
      {
        q: "Why did Amara go up to the attic?",
        options: [
          "She was looking for her grandfather",
          "She wanted to hide from the rain",
          "Her curiosity was stronger than the rule",
          "She had lost a toy",
        ],
        answer: 2,
        type: "detail",
        why: "The first line says curiosity won over the instruction to stay out.",
      },
      {
        q: "What was unusual about the map?",
        options: [
          "It showed a different country",
          "It showed her street as it used to be, with a tree and a pond",
          "It had no writing on it",
          "It showed a hidden treasure",
        ],
        answer: 1,
        type: "detail",
        why: "The bakery was a tree and the bus stop a pond, so the map showed the past.",
      },
      {
        q: "What does \"scolding\" mean?",
        options: ["A warm drink", "A gift", "An angry telling-off", "A long silence"],
        answer: 2,
        type: "vocabulary",
        why: "She expected trouble, but her grandfather smiled instead.",
      },
      {
        q: "What can you infer about how Amara's grandfather felt when he saw the map?",
        options: [
          "Angry that she had found it",
          "Fond of the memories it brought back",
          "Confused about who drew it",
          "Worried about the attic floor",
        ],
        answer: 1,
        type: "inference",
        why: "He smiled like greeting an old friend and shared a happy memory of skating.",
      },
      {
        q: "What is the main message of the story?",
        options: [
          "Never go where you are told not to",
          "Places change, and recording them helps others understand the past",
          "Winter is the best season",
          "Old paper is valuable",
        ],
        answer: 1,
        type: "main idea",
        why: "The grandfather's idea to map the present for the future ties the story together.",
      },
    ],
  },
  {
    id: "bee-swarm-vote",
    title: "How a Bee Swarm Chooses a Home",
    genre: "Science",
    level: 3,
    emoji: "🐝",
    paragraphs: [
      "When a honeybee colony grows too crowded, about half the bees leave with the old queen and hang in a dense cluster from a branch. They cannot stay there. They need a new home, and choosing the wrong one could mean death in winter.",
      "The decision is made by a few hundred scout bees. Each scout flies off to search for a cavity that is the right size, dry, and well sheltered. When she returns, she performs a waggle dance on the surface of the cluster. The angle of the dance points toward her discovery, and its length shows how far away it is.",
      "Better sites earn longer, livelier dances, so more scouts are persuaded to go and inspect them. Over several hours, support for weak sites fades while support for the best one grows. Scouts check the options for themselves rather than simply copying each other.",
      "Eventually enough scouts gather at one site to signal that a decision has been reached. The scouts then rouse the whole swarm, and thousands of bees lift off together to fly to the new home. No single bee is in charge, yet the group almost always makes an excellent choice.",
    ],
    vocab: [
      { word: "cavity", meaning: "a hollow space, such as inside a tree" },
      { word: "persuaded", meaning: "convinced to do something" },
      { word: "rouse", meaning: "to wake up and stir into action" },
    ],
    questions: [
      {
        q: "Who decides where the swarm will live?",
        options: [
          "The queen bee alone",
          "A few hundred scout bees",
          "Every bee in the swarm equally",
          "Beekeepers",
        ],
        answer: 1,
        type: "detail",
        why: "Paragraph two says the decision is made by a few hundred scouts.",
      },
      {
        q: "What does the length of a waggle dance tell the other bees?",
        options: [
          "How dangerous the site is",
          "How big the site is",
          "How far away the site is",
          "How many bees live there",
        ],
        answer: 2,
        type: "detail",
        why: "The angle shows direction and the length shows distance.",
      },
      {
        q: "What does \"persuaded\" mean in paragraph three?",
        options: ["Forced", "Convinced", "Frightened", "Confused"],
        answer: 1,
        type: "vocabulary",
        why: "Livelier dances convince more scouts to go and look.",
      },
      {
        q: "What does the passage suggest about how the swarm's choice is good?",
        options: [
          "The queen always picks the first site found",
          "Scouts check sites themselves and support builds for the best one",
          "The scouts always agree at once",
          "The swarm flips a coin",
        ],
        answer: 1,
        type: "inference",
        why: "Independent checking plus stronger dances for better sites leads to a good result.",
      },
      {
        q: "Which title would best fit the passage?",
        options: [
          "Why Bees Make Honey",
          "A Leaderless Group Makes a Smart Decision",
          "The Danger of Winter",
          "The Life of the Queen",
        ],
        answer: 1,
        type: "main idea",
        why: "No bee is in charge, yet the group chooses well, which is the central idea.",
      },
    ],
  },
  {
    id: "blackout",
    title: "The Night the Lights Went Out",
    genre: "Story",
    level: 1,
    emoji: "🔦",
    paragraphs: [
      "At 7:42 on a Tuesday evening, the whole street went dark. Kenji heard the fridge stop humming, then his little sister Mei called from the next room. \"Kenji! Everything is off!\"",
      "He found her in the hallway, clutching a toy rabbit. Their parents were still at work and would not be home for hours. Kenji felt his stomach tighten, but he knew someone had to be calm, and tonight it was him.",
      "\"Okay,\" he said. \"First, we get light.\" He remembered the flashlight in the kitchen drawer, but its batteries were dead. So he looked around and had another idea. He set his phone to its lowest brightness to save power, then stood it upright inside a clear glass of water. The glass spread the glow across the table like a small lantern.",
      "They ate cold sandwiches and played a guessing game by phone-lantern. When the lights finally flickered back at ten, Mei was fast asleep on the sofa. Kenji switched off the glass, covered her with a blanket, and realised he had not felt afraid for a long time.",
    ],
    vocab: [
      { word: "clutching", meaning: "holding tightly" },
      { word: "flickered", meaning: "shone unsteadily, on and off" },
      { word: "lantern", meaning: "a lamp inside a protective case" },
    ],
    questions: [
      {
        q: "Why was the flashlight no help?",
        options: [
          "It was broken in half",
          "Its batteries were dead",
          "Mei had taken it",
          "It was in the garage",
        ],
        answer: 1,
        type: "detail",
        why: "The text says the flashlight was in the drawer, but its batteries were dead.",
      },
      {
        q: "How did Kenji make a lantern?",
        options: [
          "He lit a candle",
          "He put his phone in a glass of water to spread the light",
          "He used the toy rabbit's eyes",
          "He opened the fridge door",
        ],
        answer: 1,
        type: "detail",
        why: "He stood his phone upright inside a clear glass of water.",
      },
      {
        q: "What does \"clutching\" mean?",
        options: ["Throwing", "Holding tightly", "Hiding", "Dropping"],
        answer: 1,
        type: "vocabulary",
        why: "Mei was scared and held the toy close.",
      },
      {
        q: "Why did Kenji lower his phone's brightness?",
        options: [
          "To save battery power",
          "To avoid waking Mei",
          "Because the screen was cracked",
          "To make the game harder",
        ],
        answer: 0,
        type: "inference",
        why: "The text says he did it to save power, since they did not know how long the outage would last.",
      },
      {
        q: "What is the main idea of the story?",
        options: [
          "Phones are better than flashlights",
          "Staying calm and thinking creatively can solve a problem and ease fear",
          "Sisters should never be left alone",
          "Blackouts are rare",
        ],
        answer: 1,
        type: "main idea",
        why: "Kenji's calm thinking turned a scary evening into a safe one.",
      },
    ],
  },
];

export const getPassage = (id: string) => passages.find((p) => p.id === id);
