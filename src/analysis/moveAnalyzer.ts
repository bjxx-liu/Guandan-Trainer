import type { GameState, MoveRecord } from "../game/gameState";
import type { MoveAnalysisResult } from "./types";

export interface MoveAnalyzerInput {
  readonly stateBeforeMove: GameState;
  readonly record: MoveRecord;
}

export type MoveAnalyzer = (input: MoveAnalyzerInput) => MoveAnalysisResult;
