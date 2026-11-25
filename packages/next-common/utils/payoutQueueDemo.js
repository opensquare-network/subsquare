// Demo chain data is anchored to the start of the current day: stable enough
// for the server and the client to render the same values, and still close to
// the real clock so the times derived from block numbers read as recent.
export const DEMO_HEIGHT = 21_000_000;
export const DEMO_BLOCK_MS = 6 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_ANCHOR_MS = Math.floor(Date.now() / DAY_MS) * DAY_MS;
const DEMO_GENESIS_MS = DEMO_ANCHOR_MS - DEMO_HEIGHT * DEMO_BLOCK_MS;

export function isPayoutQueueDemoEnabled() {
  return process.env.NEXT_PUBLIC_PAYOUT_QUEUE_DEMO === "true";
}

export function demoBlockTimeAtHeight(height) {
  return DEMO_GENESIS_MS + Number(height) * DEMO_BLOCK_MS;
}
