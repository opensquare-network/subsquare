// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import useMultiAssetBountyValueState from "./useMultiAssetBountyValueState";

const mocks = vi.hoisted(() => ({
  api: null,
  balance: null,
}));

vi.mock("next-common/context/api", () => ({
  useContextApi: () => mocks.api,
}));
vi.mock("next-common/context/post", () => ({
  useOnchainData: () => ({
    address: "bounty-account",
    assetKind: {},
    bountyIndex: 1,
    value: "1000",
  }),
}));
vi.mock("next-common/context/chain", () => ({
  useChainSettings: () => ({ decimals: 0, symbol: "DOT" }),
}));
vi.mock("next-common/hooks/treasury/useAssetBalance", () => ({
  default: () => ({ balance: mocks.balance, loading: false }),
}));
vi.mock("next-common/utils/treasury/multiAssetBounty/assetKind", () => ({
  getAssetInfoFromAssetKind: () => ({ decimals: 0, symbol: "DOT" }),
}));

global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

function Probe({ onState }) {
  onState(useMultiAssetBountyValueState());
  return null;
}

async function renderHookState() {
  const states = [];
  await act(async () => {
    root.render(<Probe onState={(state) => states.push(state)} />);
    await Promise.resolve();
    await Promise.resolve();
  });
  return () => states[states.length - 1];
}

beforeEach(() => {
  mocks.api = null;
  mocks.balance = "1000";
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

describe("useMultiAssetBountyValueState", () => {
  it("keeps loading while the api is not connected yet", async () => {
    const state = await renderHookState();

    expect(state().loading).toBe(true);
    expect(state().error).toBeNull();
  });

  it("reports failed on-chain queries and ends the loading state", async () => {
    const error = new Error("RPC unavailable");
    mocks.api = {
      query: {
        multiAssetBounties: {
          bounties: vi.fn().mockRejectedValue(error),
        },
      },
    };
    vi.spyOn(console, "error").mockImplementation(() => {});

    const state = await renderHookState();
    await act(async () => {
      await Promise.resolve();
    });

    expect(state().loading).toBe(false);
    expect(state().error).toBe(error);
  });

  it("does not count a pending child refund as registerable", async () => {
    mocks.api = {
      query: {
        multiAssetBounties: {
          bounties: vi.fn().mockResolvedValue({
            isSome: true,
            unwrap: () => ({ value: "1000" }),
          }),
          childBountiesValuePerParent: vi
            .fn()
            .mockResolvedValue({ toString: () => "400" }),
          curatorDeposit: vi.fn().mockResolvedValue({ isSome: false }),
          childBounties: {
            entries: vi.fn().mockResolvedValue([
              [
                {},
                {
                  isSome: true,
                  unwrap: () => ({
                    status: { isRefundAttempted: true },
                  }),
                },
              ],
            ]),
          },
        },
      },
    };

    const state = await renderHookState();
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(state().refundPending).toBe(true);
    expect(state().unregistered.toFixed()).toBe("400");
    expect(state().registerableAmount.toFixed()).toBe("0");
  });
});
