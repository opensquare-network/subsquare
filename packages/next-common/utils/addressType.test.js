import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { isAddress } from "@polkadot/util-crypto";
import ChainTypes from "./consts/chainTypes";

const chainTypes = {
  polkadot: ChainTypes.SUBSTRATE,
  laos: ChainTypes.ETHEREUM,
  hydradx: ChainTypes.MIXED,
};

// The real settings and viewfuncs modules pull in chain logos and other jsx,
// only the chainType and the address check are relevant here
vi.mock("./consts/settings", () => ({
  default: (chain) => ({ chainType: chainTypes[chain] }),
}));
vi.mock("./viewfuncs", () => ({
  // Mirrors the real implementation: an evm address is a valid address too,
  // but it is not a base58 ss58 one
  isPolkadotAddress: (address) =>
    isAddress(address) &&
    [46, 47, 48, 49].includes(address?.length) &&
    !address.startsWith("0x"),
}));

const { getUnsupportedAddressMessage } = await import("./addressType");

const EVM = "0x7f7b6f6b6d3d9e3b6b0b9f3b5a8a2e9a1f4b0b7c";
const SUBSTRATE = "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5";

const originalChain = process.env.NEXT_PUBLIC_CHAIN;

function onChain(chain) {
  process.env.NEXT_PUBLIC_CHAIN = chain;
}

beforeEach(() => onChain("polkadot"));
afterAll(() => {
  process.env.NEXT_PUBLIC_CHAIN = originalChain;
});

describe("getUnsupportedAddressMessage", () => {
  it("accepts substrate addresses on a substrate chain", () => {
    onChain("polkadot");
    expect(getUnsupportedAddressMessage(SUBSTRATE)).toBeNull();
  });

  it("rejects evm addresses on a substrate chain", () => {
    onChain("polkadot");
    expect(getUnsupportedAddressMessage(EVM)).toBe(
      "EVM addresses are not supported on this chain.",
    );
  });

  it("accepts evm addresses on an ethereum chain", () => {
    onChain("laos");
    expect(getUnsupportedAddressMessage(EVM)).toBeNull();
  });

  it("rejects substrate addresses on an ethereum chain", () => {
    onChain("laos");
    expect(getUnsupportedAddressMessage(SUBSTRATE)).toBe(
      "Only EVM addresses are supported on this chain.",
    );
  });

  it("accepts both address types on a mixed chain", () => {
    onChain("hydradx");
    expect(getUnsupportedAddressMessage(EVM)).toBeNull();
    expect(getUnsupportedAddressMessage(SUBSTRATE)).toBeNull();
  });

  it("does not report empty or malformed addresses as unsupported", () => {
    onChain("polkadot");
    expect(getUnsupportedAddressMessage("")).toBeNull();
    expect(getUnsupportedAddressMessage()).toBeNull();
    expect(getUnsupportedAddressMessage("not-an-address")).toBeNull();
  });
});
