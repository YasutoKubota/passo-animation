"use client";

import { useCallback, useRef } from "react";
import type { TypingFieldMetrics, TypingMetrics } from "./intake-schema";

function emptyField(): TypingFieldMetrics {
  return {
    firstKeyAt: null,
    lastKeyAt: null,
    durationMs: 0,
    keystrokes: 0,
    backspaces: 0,
    pastes: 0,
    characterCount: 0,
  };
}

function emptyMetrics(): TypingMetrics {
  return {
    startedAt: null,
    submittedAt: null,
    totalDurationMs: 0,
    totalKeystrokes: 0,
    totalBackspaces: 0,
    totalPastes: 0,
    avgCpm: 0,
    perField: {},
  };
}

export function useTypingTracker() {
  const metricsRef = useRef<TypingMetrics>(emptyMetrics());

  const trackField = useCallback((name: string) => {
    const ensureField = () => {
      const m = metricsRef.current;
      if (!m.perField[name]) m.perField[name] = emptyField();
      return m.perField[name];
    };

    return {
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const now = Date.now();
        const m = metricsRef.current;
        const field = ensureField();

        if (!m.startedAt) m.startedAt = now;
        if (!field.firstKeyAt) field.firstKeyAt = now;
        field.lastKeyAt = now;
        field.keystrokes += 1;

        if (e.key === "Backspace" || e.key === "Delete") {
          field.backspaces += 1;
        }
      },
      onPaste: () => {
        const field = ensureField();
        field.pastes += 1;
      },
      onInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = ensureField();
        field.characterCount = (e.currentTarget.value ?? "").length;
      },
    };
  }, []);

  const finalize = useCallback((): TypingMetrics => {
    const now = Date.now();
    const m = metricsRef.current;
    m.submittedAt = now;

    let totalKeys = 0;
    let totalBackspaces = 0;
    let totalPastes = 0;
    let totalChars = 0;

    for (const field of Object.values(m.perField)) {
      if (field.firstKeyAt && field.lastKeyAt) {
        field.durationMs = field.lastKeyAt - field.firstKeyAt;
      }
      totalKeys += field.keystrokes;
      totalBackspaces += field.backspaces;
      totalPastes += field.pastes;
      totalChars += field.characterCount;
    }

    m.totalDurationMs = m.startedAt ? now - m.startedAt : 0;
    m.totalKeystrokes = totalKeys;
    m.totalBackspaces = totalBackspaces;
    m.totalPastes = totalPastes;
    m.avgCpm = m.totalDurationMs > 0
      ? Math.round((totalChars / (m.totalDurationMs / 60000)) * 100) / 100
      : 0;

    return { ...m, perField: { ...m.perField } };
  }, []);

  return { trackField, finalize };
}
