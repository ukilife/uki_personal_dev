/**
 * Mind Games — 20 quick brain breaks for between lessons.
 * Every game trains one real quality, so the fun leaves something behind.
 */

export type Quality =
  | "Focus"
  | "Memory"
  | "Concentration"
  | "Planning"
  | "Step-by-step thinking"
  | "Observation"
  | "Logical thinking"
  | "Flexibility"
  | "Quick thinking"
  | "Problem solving"
  | "Calm"
  | "Patience"
  | "Self-control"
  | "Cause & effect"
  | "Creativity"
  | "Curiosity"
  | "Good judgement"
  | "Decision making"
  | "Teamwork"
  | "Persistence";

export type GameFamily = "focus" | "thinking" | "planning" | "character" | "together";

export type MindGame = {
  id: string;
  title: string;
  emoji: string;
  quality: Quality;
  family: GameFamily;
  /** rough play time in minutes */
  minutes: number;
  /** "solo" works on one device; "class" is made for the projector */
  mode: "solo" | "class" | "both";
  /** one-line hook on the card */
  hook: string;
  /** what the player does */
  how: string;
  /** the lesson the game teaches */
  lesson: string;
  /** where this quality shows up in real life */
  realLife: string;
  /** a quick question to talk about after playing */
  talk: string;
};

export const FAMILIES: Record<GameFamily, { label: string; color: string; soft: string; blurb: string }> = {
  focus: { label: "Focus & Memory", color: "#2f7fc1", soft: "bg-sky", blurb: "Train where your attention goes — and how much it can hold." },
  thinking: { label: "Thinking Skills", color: "#1f9d8a", soft: "bg-teal-soft", blurb: "Spot patterns, reason it out, think fast and think new." },
  planning: { label: "Planning & Problem Solving", color: "#7b3fa0", soft: "bg-lilac", blurb: "Think before you move. See the steps, then take them." },
  character: { label: "Character & Calm", color: "#f7845e", soft: "bg-blush", blurb: "Patience, self-control, calm and never giving up." },
  together: { label: "Together", color: "#d9a400", soft: "bg-sun-soft", blurb: "Whole-class games that need every single person." },
};

export const MIND_GAMES: MindGame[] = [
  {
    id: "colour-clash",
    title: "Colour Clash",
    emoji: "🎨",
    quality: "Focus",
    family: "focus",
    minutes: 2,
    mode: "both",
    hook: "Read the colour, not the word. Harder than it sounds!",
    how: "A colour word appears painted in a different colour. Tap the colour of the INK, not what the word says. 20 rounds — go fast!",
    lesson: "Focus isn't about paying attention to everything. It's choosing what matters and ignoring what's loud.",
    realLife: "Reading a chapter while your phone buzzes. Listening to the teacher while friends whisper.",
    talk: "What is the 'loud word' that pulls your attention away when you study?",
  },
  {
    id: "flash-grid",
    title: "Flash Grid",
    emoji: "🧩",
    quality: "Memory",
    family: "focus",
    minutes: 3,
    mode: "both",
    hook: "Some tiles light up for a second. Can you rebuild the pattern?",
    how: "Watch the tiles that flash, then tap the same tiles. Each level adds one more tile. How far can your memory go?",
    lesson: "Memory is a muscle. Grouping things into shapes and chunks lets you hold far more than trying to remember each piece.",
    realLife: "Remembering formulas, spellings, phone numbers, and what your teacher said five minutes ago.",
    talk: "Did you remember the tiles one by one, or as a shape? Which worked better?",
  },
  {
    id: "echo-chain",
    title: "Echo Chain",
    emoji: "🔔",
    quality: "Concentration",
    family: "focus",
    minutes: 3,
    mode: "both",
    hook: "Watch and listen. The chain grows by one every round.",
    how: "Four bells light up and chime in a sequence. Repeat it exactly. Each round the chain grows longer — one slip and it's over.",
    lesson: "Concentration means staying with something from start to finish. The moment your mind wanders, the chain breaks.",
    realLife: "Following multi-step instructions, solving a long maths problem, learning a dance or a song.",
    talk: "At what point did your mind start to drift? What brought it back?",
  },
  {
    id: "tower-shift",
    title: "Tower Shift",
    emoji: "🗼",
    quality: "Planning",
    family: "planning",
    minutes: 4,
    mode: "both",
    hook: "Move the whole tower — but a big disc can never sit on a small one.",
    how: "Move all discs from the first peg to the last. One disc at a time, and never put a bigger disc on a smaller one. Try to use the fewest moves.",
    lesson: "Big goals are solved by planning backwards: first see the final step, then work out what must happen before it.",
    realLife: "Planning revision before exams, saving money for something big, organising an event.",
    talk: "Did you plan before moving, or just start? What changed on your second try?",
  },
  {
    id: "robot-route",
    title: "Robot Route",
    emoji: "🤖",
    quality: "Step-by-step thinking",
    family: "planning",
    minutes: 4,
    mode: "both",
    hook: "Program the robot's path BEFORE it moves. No changes once it starts!",
    how: "Build a list of arrow moves to guide the robot to the star without hitting rocks. Then press Run and watch your plan play out.",
    lesson: "Clear step-by-step thinking turns a big messy problem into small moves you can check one at a time.",
    realLife: "Writing an essay outline, following a recipe, coding, giving someone directions.",
    talk: "Where did your plan go wrong? How did you find the exact step that broke it?",
  },
  {
    id: "spot-the-change",
    title: "Spot the Change",
    emoji: "🔍",
    quality: "Observation",
    family: "focus",
    minutes: 2,
    mode: "both",
    hook: "Look closely. Blink. Something changed — what?",
    how: "Study the grid of pictures. It disappears for a moment and one picture changes. Tap the one that's different.",
    lesson: "Observation is noticing on purpose. Good observers scan in an order instead of glancing everywhere at once.",
    realLife: "Spotting mistakes in your work, noticing a friend who seems upset, reading a science experiment.",
    talk: "What strategy did you use to scan the grid? Row by row? Corners first?",
  },
  {
    id: "pattern-breaker",
    title: "Pattern Breaker",
    emoji: "🔢",
    quality: "Logical thinking",
    family: "thinking",
    minutes: 3,
    mode: "both",
    hook: "Every sequence hides a rule. Crack it and find what comes next.",
    how: "Look at the sequence of numbers or shapes. Find the hidden rule and pick what comes next.",
    lesson: "Logical thinking means finding the rule behind things instead of guessing. Once you see the rule, the answer is obvious.",
    realLife: "Maths, science patterns, understanding why things keep happening the same way in your life.",
    talk: "Which pattern was hardest? How did you finally crack it?",
  },
  {
    id: "rule-switch",
    title: "Rule Switch",
    emoji: "🔀",
    quality: "Flexibility",
    family: "thinking",
    minutes: 2,
    mode: "both",
    hook: "Sort by colour… now by shape… now by colour! The rules keep changing.",
    how: "Each card goes left or right. The rule at the top says whether to sort by COLOUR or by SHAPE — and it switches without warning.",
    lesson: "Flexible minds adapt quickly when the rules change. Being stuck in 'the old way' slows you down.",
    realLife: "A new teacher, a new school, a new plan when the first one fails, switching between subjects.",
    talk: "How did it feel when the rule changed? When has life changed the rules on you?",
  },
  {
    id: "brain-sprint",
    title: "Brain Sprint",
    emoji: "⚡",
    quality: "Quick thinking",
    family: "thinking",
    minutes: 1,
    mode: "both",
    hook: "45 seconds. As many sums as you can. Ready, set…",
    how: "Answer quick maths questions as fast as you can in 45 seconds. Right answers add points — wrong ones don't take any away.",
    lesson: "Quick thinking is built by practice. The more you train the basics, the faster your brain can grab the answer.",
    realLife: "Mental maths at the shop, answering in class, reacting quickly in sport.",
    talk: "Did rushing make you make mistakes? How do you balance speed and accuracy?",
  },
  {
    id: "weigh-it-up",
    title: "Weigh It Up",
    emoji: "⚖️",
    quality: "Problem solving",
    family: "planning",
    minutes: 3,
    mode: "both",
    hook: "🍎 + 🍎 = 10. 🍎 + 🍌 = 8. So what is 🍌?",
    how: "Each puzzle gives picture clues. Use what you know to work out the value of the mystery picture.",
    lesson: "Problem solving means starting with what you KNOW and using it to unlock what you don't.",
    realLife: "Algebra, budgeting, figuring out why something isn't working.",
    talk: "What was the first clue you used? Why start there?",
  },
  {
    id: "breathe-bubble",
    title: "Breathe Bubble",
    emoji: "🫧",
    quality: "Calm",
    family: "character",
    minutes: 2,
    mode: "class",
    hook: "A one-minute reset for the whole class. Breathe with the bubble.",
    how: "Breathe in as the bubble grows, hold, breathe out as it shrinks, hold. Four rounds of box breathing — together.",
    lesson: "Calm is a skill, not a mood. Slow breathing tells your body it's safe, so your thinking brain switches back on.",
    realLife: "Before an exam, before speaking in front of people, when you're angry or upset.",
    talk: "How does your body feel now compared to one minute ago?",
  },
  {
    id: "ten-second-sense",
    title: "Ten-Second Sense",
    emoji: "⏱️",
    quality: "Patience",
    family: "character",
    minutes: 2,
    mode: "both",
    hook: "Stop the hidden timer at exactly 10.00 seconds. No peeking!",
    how: "Press Start. The timer disappears. Press Stop when you think exactly 10 seconds have passed. How close can you get?",
    lesson: "Patience is staying steady instead of rushing. Most people stop too early — the urge to rush is strong!",
    realLife: "Waiting for results, letting someone finish speaking, not giving up on a habit too soon.",
    talk: "Did you stop too early or too late? What does that say about you?",
  },
  {
    id: "captain-says",
    title: "Captain Says",
    emoji: "🧑‍✈️",
    quality: "Self-control",
    family: "character",
    minutes: 2,
    mode: "both",
    hook: "Only obey when the Captain says so. Your hands will want to move!",
    how: "Commands appear. Tap the matching button ONLY if the command begins with 'Captain says'. If not — freeze!",
    lesson: "Self-control is the pause between what happens and what you do. Strong people choose their reaction.",
    realLife: "Not replying angrily, not copying in a test, saying no to peer pressure.",
    talk: "When did your hands move before your brain decided? Where does that happen in real life?",
  },
  {
    id: "ripple-lights",
    title: "Ripple Lights",
    emoji: "💡",
    quality: "Cause & effect",
    family: "planning",
    minutes: 4,
    mode: "both",
    hook: "Every tap flips a light AND its neighbours. Turn them all off.",
    how: "Tapping a light flips it and the lights next to it. Switch every light off. Think about what each tap will change.",
    lesson: "Every action has ripples. Before you act, ask: 'What else will this change?'",
    realLife: "Your words affect friends, your habits affect your future, one choice leads to the next.",
    talk: "Did fixing one light ever break another? When has that happened in your life?",
  },
  {
    id: "hundred-uses",
    title: "100 Uses",
    emoji: "🧠",
    quality: "Creativity",
    family: "thinking",
    minutes: 2,
    mode: "both",
    hook: "A brick. A spoon. A sock. How many uses can you invent in 60 seconds?",
    how: "You get a random everyday object. Type as many different uses for it as you can in 60 seconds. Wild ideas count!",
    lesson: "Creativity isn't magic — it's quantity. The more ideas you allow, the more likely a brilliant one shows up.",
    realLife: "Finding solutions, writing stories, starting a business, making something from nothing.",
    talk: "What was your weirdest idea? Could it actually work?",
  },
  {
    id: "riddle-room",
    title: "Riddle Room",
    emoji: "🗝️",
    quality: "Curiosity",
    family: "thinking",
    minutes: 4,
    mode: "class",
    hook: "Tricky riddles for the whole room. Think outside the box!",
    how: "Read the riddle out loud. Let the class guess. Use hints if you're stuck, then reveal the answer.",
    lesson: "Curious minds ask 'what if?' and look at things from new angles. The obvious answer is often wrong.",
    realLife: "Science, inventions, understanding people, any time you're stuck on the 'normal' way of seeing a problem.",
    talk: "Why did your first guess feel so right? What made you see it differently?",
  },
  {
    id: "good-guess",
    title: "Good Guess",
    emoji: "🫙",
    quality: "Good judgement",
    family: "thinking",
    minutes: 2,
    mode: "both",
    hook: "Dots flash for 2 seconds. How many were there? No counting!",
    how: "A cloud of dots appears very briefly. Estimate how many there were. The closer, the better your score.",
    lesson: "Good judgement is making a smart estimate when you can't know for sure — then checking and improving.",
    realLife: "How long homework will take, how much money you need, how far away something is.",
    talk: "Did your guesses get better each round? What were you learning?",
  },
  {
    id: "fork-in-the-road",
    title: "Fork in the Road",
    emoji: "🛤️",
    quality: "Decision making",
    family: "character",
    minutes: 4,
    mode: "class",
    hook: "Real situations. Two paths. See where each choice leads.",
    how: "Read a real-life situation and pick a path. See what happens now AND later. Vote as a class before revealing.",
    lesson: "Good decisions think about 'later', not just 'now'. The easy choice today is often the hard one tomorrow.",
    realLife: "Homework vs. games, honesty vs. hiding a mistake, choosing friends, choosing subjects.",
    talk: "Which choice was easy now but costly later? Have you faced one like that?",
  },
  {
    id: "count-to-twenty",
    title: "Count to Twenty",
    emoji: "🙌",
    quality: "Teamwork",
    family: "together",
    minutes: 4,
    mode: "class",
    hook: "The whole class counts to 20 — one voice at a time. No plan allowed!",
    how: "Anyone can say the next number, but if two people speak at once, start again from 1. No signals, no order. The teacher taps the counter.",
    lesson: "Teamwork needs listening, patience and reading the room — not just talking. Sometimes the best help is waiting.",
    realLife: "Group projects, team sports, family life, any conversation where everyone wants to speak.",
    talk: "What helped the class succeed? Who held back so others could go?",
  },
  {
    id: "slide-puzzle",
    title: "Slide Puzzle",
    emoji: "🧱",
    quality: "Persistence",
    family: "planning",
    minutes: 5,
    mode: "both",
    hook: "Slide the tiles into order 1 to 8. It gets messy before it gets better.",
    how: "Slide tiles into the empty space until they read 1 to 8 in order. Sometimes you must undo progress to make progress.",
    lesson: "Persistence is keeping going when it gets messy. Real progress often looks like going backwards first.",
    realLife: "Learning an instrument, improving grades, recovering after failure, building any skill.",
    talk: "Did you want to quit? What kept you going?",
  },
];

export const QUALITIES = MIND_GAMES.map((g) => g.quality);
