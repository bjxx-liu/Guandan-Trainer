import type { LevelRank } from "./cards";
import type { PlayMove } from "./moveTypes";
import type { GuandanRuleOptions } from "./rules";

export type MoveComparison = "less" | "equal" | "greater" | "notComparable";

export interface MoveComparisonContext {
  readonly currentLevelRank: LevelRank;
  readonly options: GuandanRuleOptions;
}

export interface MoveStrength {
  readonly category: PlayMove["kind"];
  readonly primaryRankValue?: number;
  readonly bombSize?: number;
  readonly isJokerBomb: boolean;
}

export interface BeatCheckResult {
  readonly canBeat: boolean;
  readonly comparison: MoveComparison;
  readonly reason?: string;
}
