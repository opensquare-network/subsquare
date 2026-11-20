import { describe, expect, it, vi } from "vitest";

vi.mock(
  "next-common/components/paraChainTeleportPopup/teleportFromRelayChainToParaChain",
  () => ({
    AssetHubParaId: 1000,
    CollectivesParaId: 1001,
  }),
);

vi.mock("../chain", () => ({
  isKusamaChain: (chain) => chain === "kusama",
  isPolkadotChain: (chain) => chain === "polkadot",
}));

vi.mock("../constants", () => ({ CHAIN: "polkadot" }));

import Chainspolyfill from "../consts/settingsPolyfill/chainsPolyfill";
import { findAllSupportedParachainCalls } from "./relayToParachainCall";
import { getParachain } from "./relayToParachainDecodeSupport";

function toParachainId(value) {
  return { toNumber: () => value };
}

function xcmSend(parachainId, encoded = "0x00") {
  return {
    section: "polkadotXcm",
    method: "send",
    args: [
      {
        isV5: true,
        asV5: {
          interior: {
            isX1: true,
            asX1: [
              {
                isParachain: true,
                asParachain: toParachainId(parachainId),
              },
            ],
          },
        },
      },
      {
        isV5: true,
        asV5: [
          {
            isTransact: true,
            asTransact: { call: { encoded } },
          },
        ],
      },
    ],
  };
}

describe("findAllSupportedParachainCalls", () => {
  it("includes the Bulletin parachain call", () => {
    const calls = findAllSupportedParachainCalls(xcmSend(1010));
    expect(calls).toHaveLength(1);
    expect(calls[0].parachainId.toNumber()).toBe(1010);
  });

  it("ignores unsupported parachains", () => {
    expect(findAllSupportedParachainCalls(xcmSend(9999))).toHaveLength(0);
  });
});

describe("getParachain", () => {
  it("maps para 1010 to the Polkadot Bulletin chain", () => {
    expect(getParachain(1010)).toBe(Chainspolyfill.polkadotBulletin);
  });
});
