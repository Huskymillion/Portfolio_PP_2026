"use client";

/* ─── Pre-computed organic fingerprint ridge paths ──
 * 80 wavy lines with multiple sine frequencies give
 * a dense topographic / fingerprint whorl appearance.
 * Computed once at module load — no runtime cost.
 */
const PATHS: string[] = (() => {
  const W = 200, H = 150;
  const count = 80;
  const paths: string[] = [];

  for (let i = 0; i < count; i++) {
    const t     = i / count;
    const baseY = -20 + t * (H + 40); // extend well beyond viewBox

    // Amplitude peaks toward centre → whorl feel
    const cDist = Math.abs(t - 0.46);
    const amp   = 3.2 + 7.5 * Math.exp(-cDist * cDist * 20);
    const phase = t * Math.PI * 26 + i * 0.42;

    let d = "";
    for (let x = -30; x <= W + 30; x += 2) {
      // Lateral whorl: phase shifts with horizontal distance from centre
      const dx = (x - W * 0.5) / W;
      const wh = dx * Math.PI * 0.9 * Math.max(0, 1 - cDist * 3);

      const y = baseY
        + amp        * Math.sin(x * 0.078 + phase + wh)
        + amp * 0.48 * Math.sin(x * 0.145 + phase * 1.35 + 1.15)
        + amp * 0.26 * Math.sin(x * 0.245 + phase * 0.72 + 0.55)
        + amp * 0.13 * Math.sin(x * 0.46  + phase * 2.1);

      d += x === -30 ? `M ${x},${y.toFixed(1)}` : ` L ${x},${y.toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
})();

/* ─── Component ──────────────────────────────────────
 * Must be placed inside a `position:relative/sticky/absolute`
 * parent that also has `overflow:hidden`.  The SVG uses
 * negative inset + overscan so no rounded white edges appear.
 */
export function FingerprintBackground() {
  return (
    <svg
      aria-hidden
      style={{
        position:      "absolute",
        inset:         "-25% -15%",   // overscan → no visible white edges
        width:         "130%",
        height:        "150%",
        zIndex:        0,
        pointerEvents: "none",
        mixBlendMode:  "multiply",
        opacity:       0.08,
      }}
      viewBox="0 0 200 150"
      preserveAspectRatio="xMidYMid slice"
    >
      {PATHS.map((d, i) => (
        <path key={i} d={d} stroke="#000" strokeWidth={0.38} fill="none" />
      ))}
    </svg>
  );
}
