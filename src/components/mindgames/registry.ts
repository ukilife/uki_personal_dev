import type { ComponentType } from "react";
import type { GameProps } from "./kit";
import { ColourClash, EchoChain, FlashGrid, SpotTheChange } from "./FocusGames";
import { BrainSprint, GoodGuess, HundredUses, PatternBreaker, RiddleRoom, RuleSwitch } from "./ThinkingGames";
import { RippleLights, RobotRoute, SlidePuzzle, TowerShift, WeighItUp } from "./PlanningGames";
import { BreatheBubble, CaptainSays, CountToTwenty, ForkInTheRoad, TenSecondSense } from "./CharacterGames";

/** game id (see lib/mindGames.ts) → playable component */
export const GAME_COMPONENTS: Record<string, ComponentType<GameProps>> = {
  "colour-clash": ColourClash,
  "flash-grid": FlashGrid,
  "echo-chain": EchoChain,
  "tower-shift": TowerShift,
  "robot-route": RobotRoute,
  "spot-the-change": SpotTheChange,
  "pattern-breaker": PatternBreaker,
  "rule-switch": RuleSwitch,
  "brain-sprint": BrainSprint,
  "weigh-it-up": WeighItUp,
  "breathe-bubble": BreatheBubble,
  "ten-second-sense": TenSecondSense,
  "captain-says": CaptainSays,
  "ripple-lights": RippleLights,
  "hundred-uses": HundredUses,
  "riddle-room": RiddleRoom,
  "good-guess": GoodGuess,
  "fork-in-the-road": ForkInTheRoad,
  "count-to-twenty": CountToTwenty,
  "slide-puzzle": SlidePuzzle,
};
