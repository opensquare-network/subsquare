// Asset switch points per section.
// Each section has its own independent switch timeline.
// Proposal #568: Fellowship switches from USDT(6) to HOLLAR(18) at block 9,247,655.
const SWITCH_POINTS = {
  fellowship: [{ blockHeight: 8599655, symbol: "HOLLAR", decimals: 18 }],
  ambassador: [],
  secretary: [],
};

/**
 * Get the salary asset info based on section and optional block height.
 * @param {string} section - "fellowship" | "ambassador" | "secretary"
 * @param {number} [blockHeight] - Optional block height to determine asset switching
 * @returns {{ symbol: string, decimals: number }}
 */
export function getSalaryAsset(section = "fellowship", blockHeight) {
  const switches = SWITCH_POINTS[section] || [];
  const active = [...switches]
    .reverse()
    .find(
      (s) =>
        blockHeight !== undefined &&
        blockHeight !== null &&
        blockHeight >= s.blockHeight,
    );
  if (active) return { symbol: active.symbol, decimals: active.decimals };
  return { symbol: "USDT", decimals: 6 };
}
