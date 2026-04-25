export const PLAYER_IDS = [0, 1, 2, 3] as const;
export type PlayerId = (typeof PLAYER_IDS)[number];

export const TEAM_IDS = [0, 1] as const;
export type TeamId = (typeof TEAM_IDS)[number];

export type ActorType = "human" | "bot";
export type PlayerMap<T> = { readonly [P in PlayerId]: T };

export function getTeamId(playerId: PlayerId): TeamId {
  return playerId === 0 || playerId === 2 ? 0 : 1;
}

export function isTeammate(a: PlayerId, b: PlayerId): boolean {
  return getTeamId(a) === getTeamId(b);
}

export function nextPlayerId(playerId: PlayerId): PlayerId {
  return ((playerId + 1) % PLAYER_IDS.length) as PlayerId;
}
