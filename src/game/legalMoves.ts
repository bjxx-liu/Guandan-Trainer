import type { Card, LevelRank } from "./cards";
import type { LastValidMove } from "./gameState";
import type { LegalMove, MoveDescriptor } from "./moveTypes";
import type { PlayerId } from "./players";
import type { GuandanRuleOptions } from "./rules";

export interface LegalMoveContext {
  readonly playerId: PlayerId;
  readonly hand: readonly Card[];
  readonly previousMove: LastValidMove | null;
  readonly currentLevelRank: LevelRank;
  readonly options: GuandanRuleOptions;
  readonly canPass: boolean;
}

export interface MoveValidationResult {
  readonly legal: boolean;
  readonly move: MoveDescriptor;
  readonly reason?: string;
}

export type LegalMoveGenerator = (
  context: LegalMoveContext,
) => readonly LegalMove[];

export type MoveValidator = (
  cards: readonly Card[],
  context: LegalMoveContext,
) => MoveValidationResult;
