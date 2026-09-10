/** Strong offbeat attacks found by spectral flux in Poppin Bottles.
 * Times are snapped to the nearest 30 fps half-beat; e.g. the 9.288s attack
 * becomes frame 279, followed by the main beat at 288 (9.6s).
 * Main beats remain separate so they are never lost to a loudness threshold.
 */
export const offbeatAccents = [
  171, 189, 279, 351, 495, 513, 621, 927, 999, 1071, 1143, 1197, 1233, 1251,
  1269, 1287, 1305, 1341, 1377, 1395, 1413, 1449, 1485, 1503, 1521, 1557, 1575,
  1593, 1629, 1647, 1665, 1701, 1719,
];

export const accentAt = (frame: number) => {
  const main = Math.floor(frame / 18) * 18;
  let latest = main;
  let strength = 1;
  for (const offbeat of offbeatAccents) {
    if (offbeat > main && offbeat <= frame) {
      latest = offbeat;
      strength = 0.72;
    }
  }
  return {
    index: Math.floor(frame / 18),
    impulse: strength * Math.exp(-(frame - latest) / 3.8),
  };
};
