export const SUITS = ["clubs", "diamonds", "hearts", "spades"] as const;
export type Suit = (typeof SUITS)[number];

export const NATURAL_RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;
export type NaturalRank = (typeof NATURAL_RANKS)[number];

export const BASE_RANK_ORDER = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
  "2",
] as const satisfies readonly NaturalRank[];

export const JOKER_COLORS = ["small", "big"] as const;
export type JokerColor = (typeof JOKER_COLORS)[number];

export type DeckId = 0 | 1;
export type CardId = string;
export type LevelRank = NaturalRank;

export interface BaseCard {
  readonly id: CardId;
  readonly deckId: DeckId;
}

export interface StandardCard extends BaseCard {
  readonly kind: "standard";
  readonly suit: Suit;
  readonly rank: NaturalRank;
}

export interface JokerCard extends BaseCard {
  readonly kind: "joker";
  readonly joker: JokerColor;
}

export type Card = StandardCard | JokerCard;

export interface WildcardAssignment {
  readonly wildcardCardId: CardId;
  readonly asRank: NaturalRank;
  readonly asSuit?: Suit;
}

export const DEFAULT_LEVEL_RANK: LevelRank = "2";
export const WILD_SUIT: Suit = "hearts";

export function isStandardCard(card: Card): card is StandardCard {
  return card.kind === "standard";
}

export function isJokerCard(card: Card): card is JokerCard {
  return card.kind === "joker";
}
