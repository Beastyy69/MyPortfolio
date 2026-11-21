import PixelSprite from './PixelSprite.jsx';

const BUILDINGS = [38, 64, 46, 82, 54, 70, 40, 92, 58, 48, 76, 44, 66, 86, 50, 60];

/** Original side‑scrolling neon city strip with a running pixel robot. */
export default function ArcadeStrip() {
  const skyline = (
    <div className="strip__skyline">
      {BUILDINGS.map((h, i) => (
        <span key={i} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip__sun" />
      <div className="strip__track strip__track--slow">
        {skyline}
        {skyline}
      </div>
      <div className="strip__track strip__track--fast strip__coins">
        {Array.from({ length: 2 }, (_, k) => (
          <div key={k} className="strip__coin-set">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <PixelSprite key={i} name="coin" size={3} style={{ marginTop: i % 3 === 1 ? -26 : 0 }} />
            ))}
          </div>
        ))}
      </div>
      <div className="strip__runner">
        <PixelSprite name="robot" size={4} />
      </div>
      <div className="strip__ground" />
    </div>
  );
}
