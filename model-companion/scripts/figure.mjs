/**
 * Mannequin figure renderer — produces original SVG pose diagrams.
 *
 * Poses are described with simple forward kinematics: a pelvis position,
 * a torso angle and absolute limb angles. Angles are in degrees, where
 * 0° points straight down, 90° points right, -90° left and 180° up.
 *
 * Output is a self-contained SVG string (no external fonts or assets),
 * used as clearly labelled placeholder artwork until real, licensed
 * reference photography is added.
 */

const W = 400;
const H = 500;

export const PALETTE = {
  paper: '#F3EEE4',
  paperDeep: '#E7E0D2',
  ink: '#1D1C1A',
  inkSoft: '#6E6A62',
  limbNear: '#FBF8F2',
  limbFar: '#DCD4C5',
  sanguine: '#B5532F',
  tape: '#C9A227',
};

// Segment lengths (≈ 8-head figure, head ≈ 52px)
const L = {
  torso: 148,
  neck: 40,
  shoulder: 38,
  hip: 23,
  upperArm: 76,
  forearm: 70,
  thigh: 104,
  shin: 100,
  foot: 24,
};

const rad = (d) => (d * Math.PI) / 180;
const dir = (deg) => [Math.sin(rad(deg)), Math.cos(rad(deg))];
const add = (p, deg, len) => {
  const [dx, dy] = dir(deg);
  return [p[0] + dx * len, p[1] + dy * len];
};
const f = (n) => Math.round(n * 10) / 10;

/**
 * Resolve a pose description into joint positions.
 * @param {object} p pose description
 */
export function solve(p) {
  const pelvis = p.pelvis;
  const torsoDeg = p.torso ?? 180; // direction pelvis -> neck
  const neck = add(pelvis, torsoDeg, L.torso);
  const head = add(neck, p.head ?? torsoDeg, L.neck);

  // shoulder / hip lines are perpendicular to the torso, optionally tilted
  const sw = L.shoulder * (p.shoulderWidth ?? 1);
  const hw = L.hip * (p.hipWidth ?? 1);
  const sTilt = torsoDeg - 90 + (p.shoulderTilt ?? 0);
  const hTilt = torsoDeg - 90 + (p.hipTilt ?? 0);
  const chest = add(neck, torsoDeg + 180, 14);
  const shoulderA = add(chest, sTilt, -sw); // image-left
  const shoulderB = add(chest, sTilt, sw); // image-right
  const hipA = add(pelvis, hTilt, -hw);
  const hipB = add(pelvis, hTilt, hw);

  const limb = (root, a, b, la, lb) => {
    const mid = add(root, a, la);
    const end = add(mid, b, lb);
    return [root, mid, end];
  };

  const armA = limb(shoulderA, p.armA[0], p.armA[1], L.upperArm, L.forearm);
  const armB = limb(shoulderB, p.armB[0], p.armB[1], L.upperArm, L.forearm);
  const legA = limb(hipA, p.legA[0], p.legA[1], L.thigh * (p.legAScale ?? 1), L.shin * (p.legAScale ?? 1));
  const legB = limb(hipB, p.legB[0], p.legB[1], L.thigh * (p.legBScale ?? 1), L.shin * (p.legBScale ?? 1));

  const foot = (leg, deg) => add(leg[2], deg ?? 90, L.foot);
  const footA = foot(legA, p.footA);
  const footB = foot(legB, p.footB);

  return { pelvis, neck, head, chest, shoulderA, shoulderB, hipA, hipB, armA, armB, legA, legB, footA, footB };
}

const line = (a, b, w, color, extra = '') =>
  `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
const poly = (pts, w, color) =>
  `<polyline points="${pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ')}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Catmull-Rom spline through points -> smooth SVG path */
function spline(points) {
  if (points.length < 2) return '';
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

function props(list = [], c, j) {
  return list
    .map((pr) => {
      if (pr.type === 'stool') {
        const { x, y, w, h } = pr;
        return [
          `<rect x="${x}" y="${y}" width="${w}" height="10" rx="2" fill="${c.paperDeep}" stroke="${c.inkSoft}" stroke-width="2"/>`,
          line([x + 8, y + 10], [x + 2, y + h], 3, c.inkSoft),
          line([x + w - 8, y + 10], [x + w - 2, y + h], 3, c.inkSoft),
          line([x + 6, y + h * 0.6], [x + w - 6, y + h * 0.6], 2, c.inkSoft),
        ].join('');
      }
      if (pr.type === 'staff') {
        let to = pr.to;
        if (pr.through) {
          // extend the staff from its base through the given hand
          const h = pr.through === 'handA' ? j.armA[2] : j.armB[2];
          const dx = h[0] - pr.from[0];
          const dy = h[1] - pr.from[1];
          const k = (pr.extend ?? 40) / Math.hypot(dx, dy) + 1;
          to = [pr.from[0] + dx * k, pr.from[1] + dy * k];
        }
        return line(pr.from, to, 5, c.inkSoft);
      }
      if (pr.type === 'cushion') {
        const { x, y, w, h } = pr;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${c.paperDeep}" stroke="${c.inkSoft}" stroke-width="2"/>`;
      }
      if (pr.type === 'mat') {
        const { x, y, w } = pr;
        return `<rect x="${x}" y="${y}" width="${w}" height="8" rx="3" fill="${c.paperDeep}" stroke="${c.inkSoft}" stroke-width="1.5"/>`;
      }
      return '';
    })
    .join('');
}

/**
 * Render a pose to an SVG string.
 * @param {object} pose  pose description (see solve)
 * @param {object} opts  { mode: 'line'|'silhouette', label, number, gesture, plumb, marks, tape, ground }
 */
export function render(pose, opts = {}) {
  const c = PALETTE;
  const j = solve(pose);
  const mode = opts.mode ?? 'line';
  const sil = mode === 'silhouette';
  const ground = pose.ground ?? 452;

  // limb widths
  const w = { arm: 17, fore: 14, thigh: 24, shin: 18, foot: 11, torso: 52, hips: 40, neck: 15 };
  const outline = 4.5;

  const nearIsB = (pose.near ?? 'b') === 'b';
  const farArm = nearIsB ? j.armA : j.armB;
  const nearArm = nearIsB ? j.armB : j.armA;
  const farLeg = nearIsB ? j.legA : j.legB;
  const nearLeg = nearIsB ? j.legB : j.legA;
  const farFoot = nearIsB ? j.footA : j.footB;
  const nearFoot = nearIsB ? j.footB : j.footA;

  const limbStrokes = (arm, leg, foot, color, extra) => {
    const out = [];
    out.push(line(leg[0], leg[1], w.thigh + extra, color));
    out.push(line(leg[1], leg[2], w.shin + extra, color));
    out.push(line(leg[2], foot, w.foot + extra, color));
    out.push(line(arm[0], arm[1], w.arm + extra, color));
    out.push(line(arm[1], arm[2], w.fore + extra, color));
    out.push(`<circle cx="${f(arm[2][0])}" cy="${f(arm[2][1])}" r="${(w.fore + extra) / 2 + 1.5}" fill="${color}"/>`);
    return out.join('');
  };

  const torsoStrokes = (color, extra) => {
    const midChest = [(j.neck[0] + j.pelvis[0]) / 2, (j.neck[1] + j.pelvis[1]) / 2];
    const ribTop = [j.chest[0] * 0.8 + midChest[0] * 0.2, j.chest[1] * 0.8 + midChest[1] * 0.2];
    return [
      line(j.shoulderA, j.shoulderB, 26 + extra, color),
      line(ribTop, midChest, w.torso + extra, color),
      line(midChest, j.pelvis, w.torso * 0.72 + extra, color),
      line(j.hipA, j.hipB, w.hips + extra, color),
      line(j.neck, j.head, w.neck + extra, color),
    ].join('');
  };

  const headShape = (fill, stroke, sw) => {
    const ang = Math.atan2(j.head[1] - j.neck[1], j.head[0] - j.neck[0]) * (180 / Math.PI) + 90;
    const hc = add(j.neck, (pose.head ?? pose.torso ?? 180), L.neck + 8);
    return `<ellipse cx="${f(hc[0])}" cy="${f(hc[1])}" rx="19" ry="25" transform="rotate(${f(ang)} ${f(hc[0])} ${f(hc[1])})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  };

  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${(opts.label ?? 'Pose diagram').replace(/"/g, '')}">`,
  );
  parts.push(`<rect width="${W}" height="${H}" fill="${c.paper}"/>`);

  // faint sketchbook grid / proportion marks
  parts.push(`<g stroke="${c.ink}" stroke-opacity="0.06" stroke-width="1">`);
  for (let y = 50; y < H; y += 50) parts.push(`<line x1="24" y1="${y}" x2="${W - 24}" y2="${y}"/>`);
  parts.push('</g>');

  // ground
  if (opts.ground !== false) {
    parts.push(line([30, ground + 4], [W - 30, ground + 4], 1.5, c.ink, ' stroke-opacity="0.35"'));
  }

  const sc = pose.scale ?? 0.9;
  const gy = ground + 4;
  parts.push(`<g transform="translate(${200 + (pose.shiftX ?? 0)} ${gy}) scale(${sc}) translate(-200 -${gy})">`);
  parts.push(props(pose.props, c, j));

  if (opts.tape) {
    for (const p of [farFoot, nearFoot, ...(opts.tapeExtra ?? [])]) {
      const tp = [p[0], Math.min(p[1] + 8, ground + 4)];
      parts.push(line([tp[0] - 9, tp[1] - 5], [tp[0] + 9, tp[1] + 5], 4, c.tape));
      parts.push(line([tp[0] - 9, tp[1] + 5], [tp[0] + 9, tp[1] - 5], 4, c.tape));
    }
  }

  if (sil) {
    const s = c.ink;
    parts.push(limbStrokes(farArm, farLeg, farFoot, s, 2));
    parts.push(torsoStrokes(s, 2));
    parts.push(limbStrokes(nearArm, nearLeg, nearFoot, s, 2));
    parts.push(headShape(s, s, 2));
  } else {
    // far side: outline then fill (slightly darker)
    parts.push(limbStrokes(farArm, farLeg, farFoot, c.ink, outline));
    parts.push(limbStrokes(farArm, farLeg, farFoot, c.limbFar, 0));
    // torso + head
    parts.push(torsoStrokes(c.ink, outline));
    parts.push(headShape(c.ink, c.ink, 0));
    parts.push(torsoStrokes(c.limbNear, 0));
    parts.push(headShape(c.limbNear, c.ink, 2.2));
    // near side
    parts.push(limbStrokes(nearArm, nearLeg, nearFoot, c.ink, outline));
    parts.push(limbStrokes(nearArm, nearLeg, nearFoot, c.limbNear, 0));
    // construction: spine centre line + joint dots
    parts.push(poly([j.neck, j.chest, j.pelvis], 1.2, c.inkSoft));
    for (const p of [nearArm[1], nearLeg[1], farArm[1], farLeg[1]]) {
      parts.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.4" fill="${c.inkSoft}"/>`);
    }
  }

  // gesture line (line of action)
  if (opts.gesture !== false && !sil) {
    const support = pose.support === 'a' ? j.legA[2] : pose.support === 'b' ? j.legB[2] : null;
    const headTop = add(j.neck, pose.head ?? pose.torso ?? 180, L.neck + 30);
    const pts = pose.gesturePoints
      ? pose.gesturePoints.map((k) => resolvePoint(j, k))
      : [headTop, j.neck, j.chest, j.pelvis, ...(support ? [j[pose.support === 'a' ? 'legA' : 'legB'][1], support] : [])];
    parts.push(
      `<path d="${spline(pts)}" fill="none" stroke="${c.sanguine}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.85" stroke-dasharray="0"/>`,
    );
  }

  // plumb line from pit of neck
  if (opts.plumb) {
    parts.push(
      line([j.neck[0], j.neck[1]], [j.neck[0], ground + 4], 1.5, c.sanguine, ' stroke-dasharray="5 6" stroke-opacity="0.9"'),
    );
    parts.push(`<circle cx="${f(j.neck[0])}" cy="${f(j.neck[1])}" r="4" fill="${c.sanguine}"/>`);
  }

  // strain / attention marks
  for (const m of opts.marks ?? []) {
    const p = resolvePoint(j, m);
    parts.push(
      `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="15" fill="none" stroke="${c.sanguine}" stroke-width="2.5" stroke-dasharray="4 4"/>`,
    );
  }

  parts.push('</g>');

  // caption strip
  if (opts.caption !== false) {
    parts.push(
      `<text x="24" y="${H - 14}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10.5" letter-spacing="1.2" fill="${c.inkSoft}">${(
        opts.caption ?? 'PLACEHOLDER · ORIGINAL DIAGRAM'
      ).toUpperCase()}</text>`,
    );
    if (opts.number) {
      parts.push(
        `<text x="${W - 24}" y="${H - 14}" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10.5" letter-spacing="1.2" fill="${c.inkSoft}">${opts.number}</text>`,
      );
    }
  }

  parts.push('</svg>');
  return parts.join('');
}

function resolvePoint(j, key) {
  const map = {
    head: j.head,
    neck: j.neck,
    chest: j.chest,
    pelvis: j.pelvis,
    shoulderA: j.shoulderA,
    shoulderB: j.shoulderB,
    elbowA: j.armA[1],
    elbowB: j.armB[1],
    handA: j.armA[2],
    handB: j.armB[2],
    hipA: j.hipA,
    hipB: j.hipB,
    kneeA: j.legA[1],
    kneeB: j.legB[1],
    ankleA: j.legA[2],
    ankleB: j.legB[2],
    footA: j.footA,
    footB: j.footB,
  };
  if (Array.isArray(key)) return key;
  return map[key];
}
