#!/usr/bin/env node
/**
 * Generates the original placeholder SVG diagrams used by the app.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * Writes:
 *   public/poses/<pose-id>.svg
 *   public/guide/<illustration-id>.svg
 *
 * Only needed if you change scripts/pose-defs.mjs. Real reference
 * images can simply replace these files (see README → Adding poses).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './figure.mjs';
import { POSE_DEFS, GUIDE_DEFS } from './pose-defs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const posesDir = join(root, 'public', 'poses');
const guideDir = join(root, 'public', 'guide');
mkdirSync(posesDir, { recursive: true });
mkdirSync(guideDir, { recursive: true });

let i = 0;
for (const [id, def] of Object.entries(POSE_DEFS)) {
  i += 1;
  const svg = render(def, { label: id.replace(/-/g, ' '), number: `No. ${String(i).padStart(2, '0')}` });
  writeFileSync(join(posesDir, `${id}.svg`), svg);
}

for (const [id, { def, opts }] of Object.entries(GUIDE_DEFS)) {
  const d = typeof def === 'string' ? POSE_DEFS[def] : def;
  const svg = render(d, { label: id.replace(/-/g, ' '), ...opts });
  writeFileSync(join(guideDir, `${id}.svg`), svg);
}

console.log(`Generated ${Object.keys(POSE_DEFS).length} pose and ${Object.keys(GUIDE_DEFS).length} guide diagrams.`);
