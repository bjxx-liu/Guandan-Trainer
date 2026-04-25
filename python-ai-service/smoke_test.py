#!/usr/bin/env python3
"""Smoke test for the local Python AI service.

Run the service first, then execute:
    python smoke_test.py
"""

from __future__ import annotations

import json
import os
import sys
from typing import Dict, Optional
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = os.environ.get("DANLM_SERVICE_URL", "http://127.0.0.1:8001")


def main() -> int:
    print(f"Testing Python AI service at {BASE_URL}")

    try:
        health = request_json("GET", "/health")
        print_response("GET /health", health)

        dummy_state = {
            "state": {
                "phase": "playing",
                "currentLevelRank": "2",
                "currentPlayerId": 0,
                "players": {},
                "legalMoves": [],
            }
        }
        hints = request_json("POST", "/ai/hints", dummy_state)
        print_response("POST /ai/hints", hints)
    except (HTTPError, URLError, TimeoutError) as exc:
        print(f"Smoke test failed: {exc}", file=sys.stderr)
        print("Make sure the service is running, for example:", file=sys.stderr)
        print("  uvicorn app:app --host 127.0.0.1 --port 8001", file=sys.stderr)
        return 1

    return 0


def request_json(
    method: str,
    path: str,
    payload: Optional[Dict[str, object]] = None,
) -> Dict[str, object]:
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = Request(f"{BASE_URL}{path}", data=data, headers=headers, method=method)
    with urlopen(req, timeout=10) as response:
        raw = response.read().decode("utf-8")
        return json.loads(raw)


def print_response(label: str, response: Dict[str, object]) -> None:
    print(f"\n{label}")
    print(json.dumps(response, indent=2, sort_keys=True))


if __name__ == "__main__":
    raise SystemExit(main())
