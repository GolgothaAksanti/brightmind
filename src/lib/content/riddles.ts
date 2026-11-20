export interface Riddle {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  text: string;
  options: string[];
  answer: number;
  hints: [string, string, string];
  explain: string;
}

export const riddles: Riddle[] = [
  {
    id: "three-boxes",
    title: "The Mislabelled Boxes",
    level: 2,
    text: "Three boxes are labelled APPLES, ORANGES and MIXED. Every label is wrong. You may take out one fruit from one box without looking inside. Which box should you pick from to work out all three labels?",
    options: ["The box labelled APPLES", "The box labelled ORANGES", "The box labelled MIXED", "It does not matter"],
    answer: 2,
    hints: [
      "If every label is wrong, what must be true about the box labelled MIXED?",
      "The MIXED box cannot be mixed. So it holds only one kind of fruit.",
      "Pull one fruit from it. If it is an apple, that box is APPLES. The other two labels can then be sorted out because they are both wrong.",
    ],
    explain:
      "The MIXED label must be wrong, so that box has one kind of fruit. Whatever you draw tells you its real label, and the other two follow from the fact that all labels are wrong.",
  },
  {
    id: "river-crossing",
    title: "Crossing the River",
    level: 2,
    text: "A farmer must take a fox, a chicken and a bag of grain across a river in a boat that carries only the farmer and one item. The fox eats the chicken if left alone with it. The chicken eats the grain if left alone with it. What should the farmer take across first?",
    options: ["The fox", "The chicken", "The grain", "Nothing"],
    answer: 1,
    hints: [
      "Which two items can safely be left together on a bank?",
      "The fox and the grain do not harm each other.",
      "So the chicken is the one that must never be left with either. Take it first.",
    ],
    explain:
      "Fox and grain can stay together, so the chicken goes first. The farmer then ferries the others, bringing the chicken back when needed.",
  },
  {
    id: "birthday-days",
    title: "Days of the Week",
    level: 1,
    text: "If the day after tomorrow is Saturday, what day was it yesterday?",
    options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
    answer: 1,
    hints: [
      "Work backwards from Saturday.",
      "The day after tomorrow is Saturday, so tomorrow is Friday.",
      "That makes today Thursday, so yesterday was Wednesday.",
    ],
    explain: "Saturday is two days ahead, so today is Thursday and yesterday was Wednesday.",
  },
  {
    id: "handshakes",
    title: "Team Handshakes",
    level: 2,
    text: "Five friends meet, and each shakes hands with every other friend exactly once. How many handshakes happen in total?",
    options: ["5", "10", "15", "20"],
    answer: 1,
    hints: [
      "Try it with 2 friends, then 3, then 4. Do you see a pattern?",
      "2 friends: 1 handshake. 3 friends: 3. 4 friends: 6.",
      "Each new friend adds one handshake for every friend already there, so 5 friends gives 6 + 4 = 10.",
    ],
    explain: "The totals grow as 1, 3, 6, 10. With five friends, there are 4 + 3 + 2 + 1 = 10 handshakes.",
  },
  {
    id: "two-ropes",
    title: "The Two Ropes",
    level: 3,
    text: "Each of two ropes takes exactly 60 minutes to burn from one end to the other, but they burn unevenly. Using only these ropes and a lighter, how can you measure 45 minutes?",
    options: [
      "Light one rope at both ends, and the other at one end at the same moment",
      "Light both ropes at one end",
      "Cut a rope in four and burn the pieces",
      "It is impossible",
    ],
    answer: 0,
    hints: [
      "A rope lit at both ends burns out faster. How fast?",
      "Lit at both ends, a rope always burns out in exactly 30 minutes, however unevenly it burns.",
      "Light rope A at both ends and rope B at one end. When A finishes at 30 minutes, light the other end of B. B has 30 minutes left and now burns in 15.",
    ],
    explain: "30 minutes for rope A, then B's remaining half-hour is halved to 15 more minutes, giving 45 in total.",
  },
  {
    id: "odd-one-out",
    title: "Odd One Out",
    level: 1,
    text: "Which number does not belong in this group? 2, 3, 5, 9, 11, 13",
    options: ["2", "5", "9", "13"],
    answer: 2,
    hints: [
      "Think about what the other numbers have in common.",
      "Try dividing each number by something other than 1 and itself.",
      "9 can be divided by 3. All the others are prime numbers.",
    ],
    explain: "2, 3, 5, 11 and 13 are prime numbers, but 9 is 3 times 3.",
  },
  {
    id: "weighing-coins",
    title: "The Heavy Coin",
    level: 3,
    text: "You have 9 coins that look identical, but one is heavier. Using a balance scale, what is the smallest number of weighings that is guaranteed to find the heavy coin?",
    options: ["1", "2", "3", "4"],
    answer: 1,
    hints: [
      "A balance scale gives three results: left heavier, right heavier, or equal.",
      "Split the coins into three groups of three and compare two groups.",
      "That finds the group holding the heavy coin. Weigh two coins from that group to find the heavy one.",
    ],
    explain: "Each weighing cuts the possibilities by three: 9 coins become 3, then 1. So two weighings are enough.",
  },
  {
    id: "age-puzzle",
    title: "Brother and Sister",
    level: 2,
    text: "Nia is twice as old as her brother Kofi. In 6 years, she will be only 1.5 times his age. How old is Kofi now?",
    options: ["6", "8", "9", "12"],
    answer: 0,
    hints: [
      "Let Kofi be K years old. Then Nia is 2K.",
      "In 6 years: Nia is 2K + 6 and Kofi is K + 6.",
      "Solve 2K + 6 = 1.5 (K + 6). That gives K = 6.",
    ],
    explain: "Kofi is 6 and Nia is 12. In 6 years, they will be 12 and 18, and 18 is 1.5 times 12.",
  },
  {
    id: "light-switches",
    title: "Three Switches",
    level: 3,
    text: "Three switches are in a hallway. One controls a light in a closed room that you cannot see into from the hall. You may flip switches as you like, but you can enter the room only once. How can you tell which switch is connected?",
    options: [
      "Turn one on for a while, then turn it off, turn another on, and enter. Check the light and whether the bulb is warm.",
      "Turn all three on and enter",
      "Flip them randomly",
      "It cannot be done",
    ],
    answer: 0,
    hints: [
      "A light bulb gives off two clues, not just one.",
      "Besides glowing, a bulb that has been on gets hot.",
      "Switch 1 on for ten minutes, then off. Switch 2 on, then enter. Lit means switch 2. Off but warm means switch 1. Off and cold means switch 3.",
    ],
    explain: "Using heat as a second clue gives three different outcomes, one for each switch.",
  },
  {
    id: "truth-liar",
    title: "The Two Guards",
    level: 3,
    text: "Two guards stand by two doors. One door leads to safety, the other to danger. One guard always tells the truth and the other always lies, but you do not know which is which. You can ask one guard one question. Which question guarantees you find the safe door?",
    options: [
      "Which door is safe?",
      "Are you the truth-teller?",
      "What would the other guard say is the safe door? Then choose the opposite.",
      "Is the left door dangerous?",
    ],
    answer: 2,
    hints: [
      "A direct question gets a true answer from one guard and a false one from the other.",
      "Ask about what the other guard would say. Both guards will end up pointing to the wrong door.",
      "The truth-teller reports the liar's false answer, and the liar lies about the truth-teller's true answer. Either way you hear the danger door.",
    ],
    explain: "Both guards give you the same wrong door, so you pick the other one.",
  },
];

export const getRiddle = (id: string) => riddles.find((r) => r.id === id);
