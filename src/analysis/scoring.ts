export const MIN_MOVE_SCORE = 0;
export const MAX_MOVE_SCORE = 100;

export interface ScoreAdjustment {
  readonly label: string;
  readonly points: number;
}

export interface ScoreBreakdown {
  readonly baseScore: number;
  readonly adjustments: readonly ScoreAdjustment[];
  readonly finalScore: number;
}
