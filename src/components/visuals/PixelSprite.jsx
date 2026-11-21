// Renders tiny original pixel‑art from a text map. '.' = transparent.
export const SPRITES = {
  heart: {
    map: `
      .XX.XX.
      XXXXXXX
      XXXXXXX
      .XXXXX.
      ..XXX..
      ...X...`,
    palette: { X: '#a8473a' },
  },
  robot: {
    map: `
      ...CCCC...
      ..CWWWWC..
      ..CWKWKC..
      ..CWWWWC..
      ...CCCC...
      .PPPPPPPP.
      P.PPGGPP.P
      P.PPPPPP.P
      ..PPPPPP..
      ..PP..PP..
      ..PP..PP..
      .OOO..OOO.`,
    palette: { C: '#c9a45c', W: '#efe4cc', K: '#1b1512', P: '#6b5a7a', G: '#7d9470', O: '#c08a4a' },
  },
  coin: {
    map: `
      .YYYY.
      YYWYYY
      YWYYYD
      YWYYYD
      YYYYDD
      .YDDD.`,
    palette: { Y: '#c9a45c', W: '#efe4cc', D: '#8a6a32' },
  },
  star: {
    map: `
      ...X...
      ...X...
      .XXXXX.
      XXXXXXX
      .XXXXX.
      .XX.XX.
      X.....X`,
    palette: { X: '#c08a4a' },
  },
  trophy: {
    map: `
      YYYYYYYY
      DYYYYYYD
      D.YYYY.D
      .DYYYYD.
      ...YY...
      ...YY...
      ..YYYY..
      .DDDDDD.`,
    palette: { Y: '#c9a45c', D: '#c08a4a' },
  },
};

export default function PixelSprite({ name, size = 4, className = '', style }) {
  const sprite = SPRITES[name];
  const rows = sprite.map
    .trim()
    .split('\n')
    .map((r) => r.trim());
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * size}
      height={h * size}
      shapeRendering="crispEdges"
      className={`pixel-sprite ${className}`}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={sprite.palette[c]} />,
        ),
      )}
    </svg>
  );
}
