import type { GameState } from "../game/gameState";
import type { LegalMove } from "../game/moveTypes";

export type DanLMMistakeLevel =
  | "good"
  | "small_mistake"
  | "mistake"
  | "blunder";

export interface DanLMClientOptions {
  readonly baseUrl?: string;
  readonly fetchImpl?: typeof globalThis.fetch;
}

export interface DanLMHint {
  readonly move: unknown;
  readonly qValue: number | null;
  readonly rank: number;
  readonly reason: string;
}

export interface DanLMHintsResponse {
  readonly ok: boolean;
  readonly hints: readonly DanLMHint[];
  readonly placeholder?: boolean;
  readonly reason?: string;
  readonly adapterStatus?: unknown;
}

export interface DanLMEvaluateMoveResponse {
  readonly ok: boolean;
  readonly chosenMoveQ: number | null;
  readonly bestMoveQ: number | null;
  readonly delta: number | null;
  readonly mistakeLevel: DanLMMistakeLevel | null;
  readonly bestMove: unknown;
  readonly placeholder?: boolean;
  readonly reason?: string;
  readonly adapterStatus?: unknown;
}

export interface DanLMAutoplayResponse {
  readonly ok: boolean;
  readonly move: unknown;
  readonly qValue: number | null;
  readonly placeholder?: boolean;
  readonly reason?: string;
  readonly adapterStatus?: unknown;
}

const DEFAULT_DANLM_SERVICE_URL = "http://127.0.0.1:8001";

export async function getDanLMHints(
  state: GameState,
  options: DanLMClientOptions = {},
): Promise<DanLMHintsResponse> {
  return postJson<DanLMHintsResponse>("/ai/hints", { state }, options);
}

export async function evaluateMoveWithDanLM(
  state: GameState,
  move: LegalMove,
  options: DanLMClientOptions = {},
): Promise<DanLMEvaluateMoveResponse> {
  return postJson<DanLMEvaluateMoveResponse>(
    "/ai/evaluate-move",
    { state, move },
    options,
  );
}

export async function getDanLMAutoplayMove(
  state: GameState,
  options: DanLMClientOptions = {},
): Promise<DanLMAutoplayResponse> {
  return postJson<DanLMAutoplayResponse>("/ai/autoplay", { state }, options);
}

async function postJson<TResponse>(
  path: string,
  body: unknown,
  options: DanLMClientOptions,
): Promise<TResponse> {
  const fetcher = options.fetchImpl ?? globalThis.fetch;
  if (!fetcher) {
    throw new Error("fetch is not available in this environment.");
  }

  const response = await fetcher(`${baseUrl(options)}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`DanLM service request failed (${response.status}): ${message}`);
  }

  return (await response.json()) as TResponse;
}

function baseUrl(options: DanLMClientOptions): string {
  return (options.baseUrl ?? DEFAULT_DANLM_SERVICE_URL).replace(/\/+$/, "");
}
