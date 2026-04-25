import type { GameState, MoveRecord } from "../game/gameState";
import type { GameReview, MoveAnalysisResult } from "./types";

export interface GameReviewerInput {
  readonly finalState: GameState;
  readonly humanMoveRecords: readonly MoveRecord[];
  readonly humanMoveAnalyses: readonly MoveAnalysisResult[];
}

export type GameReviewer = (input: GameReviewerInput) => GameReview;
