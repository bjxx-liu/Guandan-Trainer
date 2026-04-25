# Python AI Service

This folder is a feasibility spike for adding DanLM as an optional AI backend
for Guandan Trainer. It does not replace the TypeScript rule engine. The
TypeScript engine remains the source of truth for game state, move validation,
and legal moves.

The Python service is intended to provide AI recommendations later:

- Q-value ranked hints
- move evaluation and mistake severity
- autoplay moves for AI opponents
- future post-game review support

## Current Status

The service currently exposes the planned HTTP shape and returns explicit
placeholder responses. No DanLM inference is run yet.

DanLM was inspected at commit `46e3f282487208c8e1fc8878ad3effd1b3855bf1`.
Its browser UI is already a FastAPI app around `GameSession` and `UIAgent`.
`GameSession.get_hints()` calls `UIAgent.get_top_k()`, which obtains Q-values
from the active seat's `EvalAgent`, sorts legal plays, deduplicates equivalent
plays, and serializes the top plays. Autoplay uses `UIAgent.select_play()`.

Direct import is currently blocked in this project because:

- DanLM is not installed as a package and does not include `pyproject.toml`,
  `setup.py`, or a requirements file.
- This machine's default `python3` is Python 3.8.5.
- DanLM's checked-in engine modules are compiled as
  `cpython-312-darwin.so`, so imports such as `danzero.engine.actions`,
  `danzero.engine.game`, and `danzero.eval.agents` do not load under Python 3.8.
- Importing DanLM's `UIAgent` also requires model dependencies such as `torch`.

## Install

From this folder:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## Run Locally

```bash
uvicorn app:app --host 127.0.0.1 --port 8001 --reload
```

Health check:

```bash
curl http://127.0.0.1:8001/health
```

Smoke test from this folder while the service is running:

```bash
python smoke_test.py
```

## Endpoints

`GET /health`

```json
{ "ok": true }
```

`POST /ai/hints`

Input can be either the raw app state or `{ "state": ... }`. Current output is
a placeholder:

```json
{
  "ok": true,
  "hints": [
    {
      "move": null,
      "qValue": null,
      "rank": 1,
      "reason": "Placeholder..."
    }
  ],
  "placeholder": true
}
```

`POST /ai/evaluate-move`

Input should be `{ "state": ..., "move": ... }`. Current output contains
`null` Q-values and a placeholder reason.

`POST /ai/autoplay`

Input can be either the raw app state or `{ "state": ... }`. Current output
contains a `null` move and a placeholder reason.

## DanLM Connection Plan

The adapter boundary is `danlm_adapter.py`. DanLM-specific imports should stay
there.

When DanLM is ready locally, configure:

```bash
export DANLM_PATH=/absolute/path/to/DanLM
export DANLM_MODEL_NAME=danzero_v1t
```

Then run the service with a Python environment compatible with DanLM, likely
Python 3.12 on macOS ARM64 unless the DanLM extensions are rebuilt.

## Current Limitations

- No TypeScript-to-DanLM state conversion exists yet.
- No DanLM model is loaded by this service yet.
- `evaluate-move` and `autoplay` are placeholders.
- Hints are placeholders and do not represent legal or recommended moves.
- DanLM's repository states additional non-commercial licensing restrictions;
  verify license requirements before using it beyond personal or academic work.

## Exact Next Steps

1. Create or select a Python 3.12 environment that can import DanLM's compiled
   `danzero` modules.
2. Decide whether to add DanLM as a git submodule, a sibling checkout referenced
   by `DANLM_PATH`, or a future package dependency.
3. Define a converter from our TypeScript `GameState` and `LegalMove[]` to the
   DanLM seat, level, hand, trick, and legal-play representation.
4. Call `UIAgent.get_top_k()` for hints and `UIAgent.select_play()` for
   autoplay, then map DanLM plays back to our TypeScript `LegalMove` shape.
5. Filter every DanLM recommendation through the TypeScript legal moves before
   exposing it to the UI.
