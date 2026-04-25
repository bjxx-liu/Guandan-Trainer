import type { Card, NaturalRank, Suit, WildcardAssignment } from "./cards";

export const MOVE_KINDS = [
  "pass",
  "single",
  "pair",
  "triple",
  "straight",
  "pairStraight",
  "tripleStraight",
  "fullHouse",
  "bomb",
  "straightFlush",
  "jokerBomb",
  "invalid",
] as const;

export type MoveKind = (typeof MOVE_KINDS)[number];
export type PlayMoveKind = Exclude<MoveKind, "pass" | "invalid">;

export interface PassMove {
  readonly kind: "pass";
  readonly isPass: true;
  readonly cards: readonly [];
  readonly cardCount: 0;
}

export interface PlayMove {
  readonly kind: PlayMoveKind;
  readonly isPass: false;
  readonly cards: readonly Card[];
  readonly cardCount: number;
  readonly primaryRank?: NaturalRank;
  readonly rankSequence?: readonly NaturalRank[];
  readonly suit?: Suit;
  readonly bombSize?: number;
  readonly usesWildcards: boolean;
  readonly wildcardAssignments: readonly WildcardAssignment[];
}

export interface InvalidMove {
  readonly kind: "invalid";
  readonly isPass: false;
  readonly cards: readonly Card[];
  readonly cardCount: number;
  readonly reason: string;
}

export type LegalMove = PassMove | PlayMove;
export type MoveDescriptor = LegalMove | InvalidMove;

export const PASS_MOVE: PassMove = {
  kind: "pass",
  isPass: true,
  cards: [],
  cardCount: 0,
};
