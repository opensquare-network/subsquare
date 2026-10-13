import { describe, expect, it } from "vitest";
import { isPrintableTextPayload } from "./payloadText.mjs";

const fromHex = (hex) =>
  Uint8Array.from(hex.match(/../g).map((byte) => parseInt(byte, 16)));

describe("utils/callDecoder/payloadText", () => {
  it("accepts text notes", () => {
    expect(
      isPrintableTextPayload(
        fromHex(
          // "2026-09 - polkadot people - Coinstudio/COLLECTIVES | $249.48 USDT"
          "323032362d3039202d20706f6c6b61646f742070656f706c65202d20436f696e73747564696f2f434f4c4c45435449564553207c20243234392e34382055534454",
        ),
      ),
    ).toBe(true);
  });

  it("accepts text with whitespace", () => {
    expect(
      isPrintableTextPayload(fromHex("5354414b45574f524c440a52504309")),
    ).toBe(true); // "STAKEWORLD\nRPC\t"
  });

  it("rejects calls, which start with index bytes", () => {
    // system.remark: pallet 0, call 0, compact length, then the text
    expect(
      isPrintableTextPayload(
        fromHex("00002868656c6c6f20776f726c642066726f6d20737562737175617265"),
      ),
    ).toBe(false);
  });

  it("rejects empty and binary payloads", () => {
    expect(isPrintableTextPayload(new Uint8Array())).toBe(false);
    expect(isPrintableTextPayload(fromHex("280501"))).toBe(false);
    expect(isPrintableTextPayload(fromHex("c3"))).toBe(false); // truncated UTF-8
    expect(isPrintableTextPayload(fromHex("001b5b"))).toBe(false); // control bytes
  });
});
