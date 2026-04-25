import type { MoveRecord } from "../game/gameState";
import type { LegalMove } from "../game/moveTypes";

export type MoveGrade = "A" | "B" | "C" | "D" | "F";

export interface SuggestedMove {
  readonly move: LegalMove;
  readonly reason: string;
  readonly estimatedScore?: number;
}

export interface MoveAnalysisResult {
  readonly turnNumber: number;
  readonly grade: MoveGrade;
  readonly score: number;
  readonly legal: boolean;
  readonly tooAggressive: boolean;
  readonly wastedBomb: boolean;
  readonly brokeGoodStructure: boolean;
  readonly hurtTeammate: boolean;
  readonly passingWouldHaveBeenBetter: boolean;
  readonly suggestedBetterMoves: readonly SuggestedMove[];
  readonly explanation: string;
}

export interface ReviewedMove {
  readonly record: MoveRecord;
  readonly analysis: MoveAnalysisResult;
}

export interface GameReview {
  readonly overallScore: number;
  readonly bestMove?: ReviewedMove;
  readonly worstMove?: ReviewedMove;
  readonly mainMistakes: readonly string[];
  readonly bombUsageEvaluation: string;
  readonly teamworkEvaluation: string;
  readonly cardStructureManagement: string;
  readonly endgameDecisionQuality: string;
  readonly suggestions: readonly [string, string, string];
}
