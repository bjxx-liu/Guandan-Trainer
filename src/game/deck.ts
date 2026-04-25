import {
  JOKER_COLORS,
  NATURAL_RANKS,
  SUITS,
  type Card,
  type DeckId,
} from "./cards";

const DECK_IDS = [0, 1] as const satisfies readonly DeckId[];

export const SINGLE_DECK_CARD_COUNT = 54;
export const GUANDAN_DECK_CARD_COUNT = 108;
export const GUANDAN_PLAYER_COUNT = 4;
export const GUANDAN_CARDS_PER_PLAYER = 27;

export type FourHands = readonly [
  readonly Card[],
  readonly Card[],
  readonly Card[],
  readonly Card[],
];

export interface ShuffleOptions {
  readonly rng?: () => number;
}

export interface DealResult {
  readonly deck: readonly Card[];
  readonly hands: FourHands;
}

export type DeckFactory = () => readonly Card[];
export type DeckShuffler = (
  cards: readonly Card[],
  options?: ShuffleOptions,
) => readonly Card[];
export type Dealer = (cards: readonly Card[]) => DealResult;

export function createDeck(): readonly Card[] {
  const cards: Card[] = [];

  for (const deckId of DECK_IDS) {
    for (const suit of SUITS) {
      for (const rank of NATURAL_RANKS) {
        cards.push({
          id: `deck-${deckId}-${suit}-${rank}`,
          deckId,
          kind: "standard",
          suit,
          rank,
        });
      }
    }

    for (const joker of JOKER_COLORS) {
      cards.push({
        id: `deck-${deckId}-joker-${joker}`,
        deckId,
        kind: "joker",
        joker,
      });
    }
  }

  return cards;
}

export function getCardFaceKey(card: Card): string {
  if (card.kind === "joker") {
    return `joker:${card.joker}`;
  }

  return `standard:${card.suit}:${card.rank}`;
}

export function shuffleDeck(
  cards: readonly Card[],
  options: ShuffleOptions = {},
): readonly Card[] {
  const rng = options.rng ?? Math.random;
  const shuffled = [...cards];

  for (
    let currentIndex = shuffled.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomValue = rng();

    if (randomValue < 0 || randomValue >= 1) {
      throw new Error(
        "shuffleDeck rng must return a number from 0 inclusive to 1 exclusive.",
      );
    }

    const swapIndex = Math.floor(randomValue * (currentIndex + 1));
    const currentCard = shuffled[currentIndex]!;
    shuffled[currentIndex] = shuffled[swapIndex]!;
    shuffled[swapIndex] = currentCard;
  }

  return shuffled;
}

export function dealCards(cards: readonly Card[]): DealResult {
  if (cards.length !== GUANDAN_DECK_CARD_COUNT) {
    throw new Error(
      `Guandan deal requires ${GUANDAN_DECK_CARD_COUNT} cards, received ${cards.length}.`,
    );
  }

  const deck = [...cards];
  const hands: FourHands = [
    deck.slice(0, GUANDAN_CARDS_PER_PLAYER),
    deck.slice(GUANDAN_CARDS_PER_PLAYER, GUANDAN_CARDS_PER_PLAYER * 2),
    deck.slice(GUANDAN_CARDS_PER_PLAYER * 2, GUANDAN_CARDS_PER_PLAYER * 3),
    deck.slice(GUANDAN_CARDS_PER_PLAYER * 3, GUANDAN_CARDS_PER_PLAYER * 4),
  ];

  return { deck, hands };
}
