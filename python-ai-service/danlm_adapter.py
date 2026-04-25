"""Adapter boundary for the optional DanLM AI backend.

DanLM-specific imports and conversion logic should live in this file only.
The current implementation intentionally returns placeholders until DanLM can
be imported and our TypeScript game state can be converted safely.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
import importlib
import os
import sys
from typing import Any, Dict, Optional


@dataclass(frozen=True)
class DanLMImportStatus:
    available: bool
    model_name: str
    danlm_path: Optional[str]
    reason: Optional[str] = None
    details: Optional[str] = None


class DanLMAdapter:
    def __init__(self, model_name: str = "danzero_v1t"):
        self.model_name = model_name
        self._status = self._probe_imports()

    @property
    def status(self) -> Dict[str, Any]:
        return asdict(self._status)

    def get_hints(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "ok": True,
            "hints": [
                {
                    "move": None,
                    "qValue": None,
                    "rank": 1,
                    "reason": self._placeholder_reason("hints"),
                }
            ],
            "placeholder": True,
            "adapterStatus": self.status,
        }

    def evaluate_move(
        self,
        state: Dict[str, Any],
        move: Dict[str, Any],
    ) -> Dict[str, Any]:
        return {
            "ok": True,
            "chosenMoveQ": None,
            "bestMoveQ": None,
            "delta": None,
            "mistakeLevel": None,
            "bestMove": None,
            "placeholder": True,
            "reason": self._placeholder_reason("move evaluation"),
            "adapterStatus": self.status,
        }

    def autoplay(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "ok": True,
            "move": None,
            "qValue": None,
            "placeholder": True,
            "reason": self._placeholder_reason("autoplay"),
            "adapterStatus": self.status,
        }

    def _probe_imports(self) -> DanLMImportStatus:
        danlm_path = os.environ.get("DANLM_PATH")
        if danlm_path:
            normalized_path = os.path.abspath(danlm_path)
            if normalized_path not in sys.path:
                sys.path.insert(0, normalized_path)
        else:
            normalized_path = None

        required_modules = (
            "danzero.engine.actions",
            "danzero.engine.game",
            "danzero.eval.agents",
        )

        try:
            for module_name in required_modules:
                importlib.import_module(module_name)

            # UIAgent is DanLM's highest-level wrapper for model loading,
            # Q-value hints, tribute hints, and autoplay decisions.
            importlib.import_module("ui.ui_agent")
        except ModuleNotFoundError as exc:
            return DanLMImportStatus(
                available=False,
                model_name=self.model_name,
                danlm_path=normalized_path,
                reason=(
                    "DanLM is not importable in this Python environment. "
                    "Set DANLM_PATH to a DanLM checkout and run with a Python "
                    "version/platform compatible with DanLM's compiled modules."
                ),
                details=f"{exc.__class__.__name__}: {exc}",
            )
        except Exception as exc:  # pragma: no cover - environment-dependent probe
            return DanLMImportStatus(
                available=False,
                model_name=self.model_name,
                danlm_path=normalized_path,
                reason="DanLM import started but failed while loading its dependencies.",
                details=f"{exc.__class__.__name__}: {exc}",
            )

        return DanLMImportStatus(
            available=True,
            model_name=self.model_name,
            danlm_path=normalized_path,
        )

    def _placeholder_reason(self, action: str) -> str:
        status_reason = self._status.reason or "DanLM state conversion is not implemented yet."
        return (
            f"Placeholder {action}: no DanLM inference was run. "
            f"{status_reason} The TypeScript rule engine remains the source "
            "of truth for legal moves."
        )
