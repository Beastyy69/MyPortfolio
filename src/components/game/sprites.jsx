/* ─────────────────────────────────────────────────────────────
   Code Frontier — original pixel sprites (text maps, '.' = clear).
   The player is "the Field Engineer": olive cap with a signal
   antenna, mustard scarf, forest jacket and a brown pack.
   All art is drawn here from scratch; no external assets.
   ───────────────────────────────────────────────────────────── */

export const PAL = {
  a: '#8a3d33', // antenna tip / brick
  k: '#211b17', // charcoal outline
  h: '#5d6b3f', // olive cap
  s: '#c99572', // skin
  m: '#b8954a', // mustard scarf
  g: '#3f5a3a', // forest jacket
  b: '#5a4632', // pack
  p: '#3e4a57', // trousers (desaturated blue)
  w: '#2b221c', // boots
  e: '#e9dcc0', // parchment
  d: '#56636f', // drone shell
  r: '#a8473a', // drone eye
};

const TOP = [
  '....a.......',
  '....k.......',
  '..hhhhhh....',
  '.hhhhhhhhh..',
  '..ssssss....',
  '..sssksk....',
  '..ssssss....',
  '.bmmmmmmm...',
  'bbgggggg....',
  'bbggggggs...',
  '.bggggggs...',
  '..gggggg....',
  '..pppppp....',
];

export const HERO = {
  w: 12,
  h: 16,
  idle: [...TOP, '..pp..pp....', '..pp..pp....', '.www..www...'],
  run1: [...TOP, '.pp....pp...', 'pp......pp..', 'ww......ww..'],
  run2: [...TOP, '...pppp.....', '...pp.pp....', '..www.ww....'],
  jump: [...TOP, '.pp...pp....', '.ww....pp...', '.......ww...'],
};

export const DRONE = {
  w: 12,
  h: 8,
  a: ['kkk..kk..kkk', '....kkkk....', '..dddddddd..', '.ddrrrrrrdd.', '.ddrreerrdd.', '..dddddddd..', '...d....d...', '..k......k..'],
  b: ['.kk..kk..kk.', '....kkkk....', '..dddddddd..', '.ddrrrrrrdd.', '.ddrreerrdd.', '..dddddddd..', '...d....d...', '..k......k..'],
};

/** Draw a sprite map onto a 2D canvas context. */
export function drawMap(ctx, map, x, y, px, flip = false) {
  const w = map[0].length;
  for (let r = 0; r < map.length; r++) {
    const row = map[r];
    for (let c = 0; c < w; c++) {
      const ch = row[c];
      if (ch === '.') continue;
      ctx.fillStyle = PAL[ch];
      const cx = flip ? w - 1 - c : c;
      ctx.fillRect(Math.round(x + cx * px), Math.round(y + r * px), px, px);
    }
  }
}

/** Same sprite as SVG rects (for DOM/SVG scenes such as the Ability Map). */
export function SpriteSVG({ map, px = 3, className, title }) {
  const rects = [];
  map.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      if (ch !== '.') rects.push(<rect key={`${r}-${c}`} x={c * px} y={r * px} width={px} height={px} fill={PAL[ch]} />);
    }),
  );
  return (
    <svg className={className} viewBox={`0 0 ${map[0].length * px} ${map.length * px}`} shapeRendering="crispEdges" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {rects}
    </svg>
  );
}
