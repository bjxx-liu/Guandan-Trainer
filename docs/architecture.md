# Architecture

## Goal

Build a clean MVP before adding any machine learning. The first version should
be deterministic, inspectable, and easy to test. The coaching layer will use
heuristics over structured game history.

## Layers

1. `src/game`

   Pure rule engine and game state. This layer owns cards, move recognition,
   move comparison, legal move validation, turn order, passing, round ending,
   and history records. It must not import React or UI code.

2. `src/bots`

   Rule-based bot policies. Bots receive a game/bot context and return a legal
   move decision. They should not mutate game state directly.

3. `src/analysis`

   Heuristic coaching. The move analyzer scores each human move immediately.
   The game reviewer summarizes the full history after the game.

4. `src/ui`

   React components only. UI state should call game/bot/analysis APIs instead
   of embedding rule logic in components.

## Core Data Flow

1. Game state exposes the current player, hand, last valid move, and legal
   moves.
2. If the current player is human, the UI submits selected cards or pass.
3. If the current player is a bot, a bot strategy chooses from legal moves.
4. The game engine validates and applies the move.
5. A structured `MoveRecord` is appended to history.
6. If the player is human, `moveAnalyzer` produces immediate feedback.
7. At game end, `gameReviewer` generates the coaching summary.

## Development Steps

1. Card representation, deck creation, shuffle, deal.
2. Basic move type recognition.
3. Move comparison.
4. Legal move validation.
5. Game state and turn logic.
6. Simple bot.
7. Minimal React UI.
8. Game history recording.
9. Real-time move analyzer.
10. Post-game reviewer.

## Hardest Parts

- Guandan has rule variants. The MVP should isolate options like heart-level
  wildcards and straight-flush bombs in `RuleContext`.
- Wildcards make move recognition and comparison harder because the same
  physical cards can represent different logical patterns.
- Legal move generation can become combinatorial. The MVP should start with
  straightforward, readable generation and optimize later only if needed.
- Bot teamwork is heuristic. The first bot should prefer passing when its
  teammate currently owns the trick, then become more aggressive near endgame.
- Coaching quality depends on history quality. Move records should preserve the
  state before the move, legal alternatives, previous move, and card counts.

## What To Implement First

Step 1 should implement only:

- `createDeck()` for two 54-card decks
- stable card IDs for duplicate physical cards
- `shuffleDeck()` with injectable RNG for tests
- `dealCards()` returning four 27-card hands
- small tests proving deck size, duplicate counts, hand sizes, and deterministic
  shuffling with a seeded or fake RNG

No UI, bot, or analysis work should begin until the rule engine basics are
covered by tests.
