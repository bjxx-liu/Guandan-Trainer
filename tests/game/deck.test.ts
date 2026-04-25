import { describe, expect, it } from "vitest";

import {
  GUANDAN_CARDS_PER_PLAYER,
  GUANDAN_DECK_CARD_COUNT,
  createDeck,
  dealCards,
  getCardFaceKey,
  shuffleDeck,
} from "../../src/game/deck";

function cardIds(cards: readonly { readonly id: string }[]): readonly string[] {
  return cards.map((card) => card.id);
}

describe("deck", () => {
  it("creates a two-deck Guandan deck with 108 unique card ids", () => {
    const deck = createDeck();

    expect(deck).toHaveLength(GUANDAN_DECK_CARD_COUNT);
    expect(new Set(cardIds(deck)).size).toBe(GUANDAN_DECK_CARD_COUNT);
  });

  it("contains exactly two copies of each physical card face", () => {
    const counts = new Map<string, number>();

    for (const card of createDeck()) {
      const key = getCardFaceKey(card);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    expect(counts.size).toBe(54);
    expect([...counts.values()]).toEqual(Array.from({ length: 54 }, () => 2));
  });

  it(
    "shuffles deterministically when an rng is injected and does not mutate input",
    () => {
      const deck = createDeck();
      const originalIds = cardIds(deck);

      const firstShuffle = shuffleDeck(deck, { rng: () => 0 });
      const secondShuffle = shuffleDeck(deck, { rng: () => 0 });

      expect(cardIds(deck)).toEqual(originalIds);
      expect(cardIds(firstShuffle)).toEqual(cardIds(secondShuffle));
      expect(cardIds(firstShuffle)).not.toEqual(originalIds);
    },
  );

  it("deals four hands of 27 cards without losing or duplicating ids", () => {
    const deck = createDeck();
    const result = dealCards(deck);
    const dealtCards = result.hands.flat();

    expect(result.hands).toHaveLength(4);
    expect(result.hands.every((hand) => hand.length === GUANDAN_CARDS_PER_PLAYER)).toBe(
      true,
    );
    expect(dealtCards).toHaveLength(GUANDAN_DECK_CARD_COUNT);
    expect(new Set(cardIds(dealtCards)).size).toBe(GUANDAN_DECK_CARD_COUNT);
  });
});
