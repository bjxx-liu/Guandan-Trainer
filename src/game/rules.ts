import {
  DEFAULT_LEVEL_RANK,
  WILD_SUIT,
  type LevelRank,
  type Suit,
} from "./cards";

export interface GuandanRuleOptions {
  readonly deckCount: 2;
  readonly playerCount: 4;
  readonly cardsPerPlayer: 27;
  readonly useHeartLevelWildcards: boolean;
  readonly wildSuit: Suit;
  readonly allowStraightFlushBomb: boolean;
  readonly minStraightLength: 5;
  readonly minPairStraightLength: 3;
  readonly minTripleStraightLength: 2;
}

export interface RuleContext {
  readonly currentLevelRank: LevelRank;
  readonly options: GuandanRuleOptions;
}

export const DEFAULT_RULE_OPTIONS: GuandanRuleOptions = {
  deckCount: 2,
  playerCount: 4,
  cardsPerPlayer: 27,
  useHeartLevelWildcards: true,
  wildSuit: WILD_SUIT,
  allowStraightFlushBomb: true,
  minStraightLength: 5,
  minPairStraightLength: 3,
  minTripleStraightLength: 2,
};

export const DEFAULT_RULE_CONTEXT: RuleContext = {
  currentLevelRank: DEFAULT_LEVEL_RANK,
  options: DEFAULT_RULE_OPTIONS,
};
