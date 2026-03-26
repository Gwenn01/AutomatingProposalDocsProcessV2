// draft-db.ts
// Browser-side SQLite via sql.js (localStorage fallback if sql.js isn't available)
// Usage: import { draftDb } from '@/services/draft-db'

import type { ProgramFormData } from '@/types/implementor-types';

export interface DraftRecord {
  id: string;           // UUID
  program_title: string;
  step: number;         // last step the user was on (1, 2, or 3)
  data: string;         // JSON blob of DraftPayload
  created_at: string;
  updated_at: string;
}

export interface DraftPayload {
  programData: ProgramFormData;
  programChildId: number | null;
  projectFormsJson: string;        // JSON
  activityFormsByProjectJson: string; // JSON
  activeProjectTab: number;
  step: number;
}

// ── Storage key for localStorage fallback ──────────────────────────────────
const LS_KEY = 'proposal_drafts_v1';

function loadAll(): DraftRecord[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAll(records: DraftRecord[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(records));
}

function uuid(): string {
  return crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── Public API ──────────────────────────────────────────────────────────────

export const draftDb = {
  /** Save a new draft or update an existing one by id. Returns the draft id. */
  upsert(payload: DraftPayload, existingId?: string): string {
    const records = loadAll();
    const now = new Date().toISOString();
    const id = existingId ?? uuid();

    const idx = records.findIndex((r) => r.id === id);
    const record: DraftRecord = {
      id,
      program_title: payload.programData.program_title || 'Untitled Draft',
      step: payload.step,
      data: JSON.stringify(payload),
      created_at: idx >= 0 ? records[idx].created_at : now,
      updated_at: now,
    };

    if (idx >= 0) {
      records[idx] = record;
    } else {
      records.unshift(record); // newest first
    }
    saveAll(records);
    return id;
  },

  /** Return all drafts, newest first. */
  list(): DraftRecord[] {
    return loadAll();
  },

  /** Get a single draft by id. */
  get(id: string): DraftRecord | null {
    return loadAll().find((r) => r.id === id) ?? null;
  },

  /** Parse the JSON payload from a record. */
  parsePayload(record: DraftRecord): DraftPayload {
    return JSON.parse(record.data) as DraftPayload;
  },

  /** Delete a draft by id. */
  delete(id: string): void {
    saveAll(loadAll().filter((r) => r.id !== id));
  },

  /** Wipe all drafts. */
  clear(): void {
    saveAll([]);
  },
};