import type { ReactNode } from 'react';

export type Call = <T>(endpoint: 'poses' | 'inspiration', method: string, body?: unknown) => Promise<T>;

export function makeCall(password: string): Call {
  return async <T,>(endpoint: string, method: string, body?: unknown) => {
    const res = await fetch(`/api/${endpoint}`, {
      method,
      headers: { 'x-admin-password': password, ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({ error: `Chyba serveru (${res.status})` }));
    if (!res.ok) throw new Error(data.error || `Chyba ${res.status}`);
    return data as T;
  };
}

export const DEPLOY_NOTE = 'Na webu se změna objeví asi za minutu.';

export type Message = { text: string; error?: boolean } | null;

export function StatusBar({ busy, message }: { busy: string; message: Message }) {
  if (!busy && !message) return null;
  return (
    <p role="status" className={`mt-5 rounded-md px-4 py-3 text-sm ${message?.error && !busy ? 'bg-red/20 text-red-bright' : 'bg-surface-2 text-fg'}`}>
      {busy || message?.text}
    </p>
  );
}

export const btnPrimary =
  'inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red px-5 text-sm font-semibold text-white hover:bg-red-bright disabled:opacity-40';
export const btnGhost =
  'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line px-4 text-sm text-fg hover:border-fg disabled:opacity-40';
export const tileBtn = 'grid size-9 place-items-center rounded-[4px] bg-black/60 text-white disabled:opacity-30';
export const input =
  'h-11 w-full rounded-md border border-line bg-surface px-3 text-[0.95rem] text-fg outline-none placeholder:text-faint focus:border-fg';

/** Labelled form field. Use `group` for sets of buttons (a <label> would swallow their names). */
export function Field({ label, hint, group, children }: { label: string; hint?: string; group?: boolean; children: ReactNode }) {
  const content = (
    <>
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-[0.78rem] text-faint">{hint}</span>}
    </>
  );
  return group ? (
    <div role="group" aria-label={label} className="flex flex-col gap-1.5 text-sm">
      {content}
    </div>
  ) : (
    <label className="flex flex-col gap-1.5 text-sm">{content}</label>
  );
}
