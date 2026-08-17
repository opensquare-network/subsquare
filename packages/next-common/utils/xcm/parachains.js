// Parachain data and lookup logic adapted from:
// https://github.com/kheopswap/kheopswap/blob/main/web/src/registry/parachains/parachains.json
// https://github.com/kheopswap/kheopswap/blob/main/web/src/registry/parachains/parachains.ts
// Attribution is kept here because `parachains.json` must remain valid JSON.
import parachains from "./parachains.json";

export function getParachainName(relay, paraId) {
  const parachain = parachains.find(
    (item) => item.relay === relay && item.paraId === Number(paraId),
  );

  return parachain?.name || `Parachain #${paraId}`;
}
