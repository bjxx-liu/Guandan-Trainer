"""FastAPI service for optional DanLM-backed Guandan AI features."""

from __future__ import annotations

import os
from typing import Any, Dict

from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from danlm_adapter import DanLMAdapter


app = FastAPI(title="Guandan Trainer Python AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

adapter = DanLMAdapter(
    model_name=os.environ.get("DANLM_MODEL_NAME", "danzero_v1t"),
)


@app.get("/health")
def health() -> Dict[str, bool]:
    return {"ok": True}


@app.post("/ai/hints")
def ai_hints(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    state = _extract_state(payload)
    return adapter.get_hints(state)


@app.post("/ai/evaluate-move")
def ai_evaluate_move(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    state = _extract_state(payload)
    move = payload.get("move") or payload.get("selectedMove") or {}
    if not isinstance(move, dict):
        move = {"raw": move}
    return adapter.evaluate_move(state, move)


@app.post("/ai/autoplay")
def ai_autoplay(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    state = _extract_state(payload)
    return adapter.autoplay(state)


def _extract_state(payload: Dict[str, Any]) -> Dict[str, Any]:
    maybe_state = payload.get("state", payload)
    if isinstance(maybe_state, dict):
        return maybe_state
    return {"raw": maybe_state}
