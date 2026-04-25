import type { GameState } from "../game/gameState";
import type { LegalMove } from "../game/moveTypes";
import type { PlayerId } from "../game/players";

export interface BotContext {
  readonly state: GameState;
  readonly playerId: PlayerId;
  readonly legalMoves: readonly LegalMove[];
  readonly teammateCurrentlyWinning: boolean;
}

export interface BotDecision {
  readonly move: LegalMove;
  readonly reason: string;
}

export interface BotPolicy {
  readonly id: string;
  readonly chooseMove: (context: BotContext) => BotDecision;
}
