import type { Card, LevelRank } from "./cards";
import type { LegalMove, MoveDescriptor, MoveKind, PlayMove } from "./moveTypes";
import type { ActorType, PlayerId, PlayerMap, TeamId } from "./players";
import type { GuandanRuleOptions } from "./rules";

export type GamePhase = "setup" | "playing" | "roundOver" | "gameOver";

export interface PlayerState {
  readonly id: PlayerId;
  readonly teamId: TeamId;
  readonly actorType: ActorType;
  readonly hand: readonly Card[];
  readonly finishedOrder?: number;
}

export interface LastValidMove {
  readonly turnNumber: number;
  readonly playerId: PlayerId;
  readonly teamId: TeamId;
  readonly move: PlayMove;
}

export interface TrickState {
  readonly leaderPlayerId: PlayerId;
  readonly currentPlayerId: PlayerId;
  readonly lastValidMove: LastValidMove | null;
  readonly consecutivePasses: number;
  readonly passedPlayerIds: readonly PlayerId[];
}

export interface GameConfig {
  readonly humanPlayerId: PlayerId;
  readonly startingLevelRank: LevelRank;
  readonly options: GuandanRuleOptions;
}

export interface MoveRecord {
  readonly turnNumber: number;
  readonly playerId: PlayerId;
  readonly teamId: TeamId;
  readonly actorType: ActorType;
  readonly cardsBeforeMove: readonly Card[];
  readonly cardsPlayed: readonly Card[];
  readonly moveType: MoveKind;
  readonly move: MoveDescriptor;
  readonly isPass: boolean;
  readonly previousMove: LastValidMove | null;
  readonly legalMovesAvailable: readonly LegalMove[];
  readonly cardCountsAfterMove: PlayerMap<number>;
}

export interface RoundResult {
  readonly finishingOrder: readonly PlayerId[];
  readonly winningTeamId: TeamId;
}

export interface GameState {
  readonly phase: GamePhase;
  readonly config: GameConfig;
  readonly currentLevelRank: LevelRank;
  readonly players: PlayerMap<PlayerState>;
  readonly trick: TrickState;
  readonly turnNumber: number;
  readonly finishedPlayerIds: readonly PlayerId[];
  readonly history: readonly MoveRecord[];
  readonly roundResult?: RoundResult;
}
