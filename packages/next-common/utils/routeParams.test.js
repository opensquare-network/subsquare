import { describe, expect, it } from "vitest";
import {
  anyOf,
  isAddressId,
  isBlockHashId,
  isBlockHeightCidId,
  isBlockHeightHashId,
  isEvidenceId,
  isNumericId,
  isNumericSegmentsId,
  isObjectId,
  isTrackId,
  matchesRouteParams,
} from "./routeParams";

const HASH = "0x3f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9012345678901234567890ab";

describe("route param validators", () => {
  it("matches numeric ids", () => {
    expect(isNumericId("1264")).toBe(true);
    expect(isNumericId("1264_0")).toBe(false);
    expect(isNumericId("summary")).toBe(false);
    expect(isNumericId("?phpinfo=1")).toBe(false);
  });

  it("matches ids built from numeric segments", () => {
    expect(isNumericSegmentsId("13")).toBe(true);
    expect(isNumericSegmentsId("13_0")).toBe(true);
    expect(isNumericSegmentsId("13_0_1234567")).toBe(true);
    expect(isNumericSegmentsId(`${1264}_${HASH}`)).toBe(false);
    expect(isNumericSegmentsId("13_")).toBe(false);
  });

  it("matches block hashes", () => {
    expect(isBlockHashId(HASH)).toBe(true);
    expect(isBlockHashId(HASH.slice(2))).toBe(false);
  });

  it("matches `<blockHeight>_<hash>` ids", () => {
    expect(isBlockHeightHashId(`1264_${HASH}`)).toBe(true);
    expect(isBlockHeightHashId(HASH)).toBe(false);
    expect(isBlockHeightHashId("1264_abc")).toBe(false);
  });

  it("matches mongo object ids", () => {
    expect(isObjectId("507f1f77bcf86cd799439011")).toBe(true);
    expect(isObjectId("507f1f77bcf86cd79943901")).toBe(false);
  });

  it("matches track ids and names", () => {
    expect(isTrackId("1")).toBe(true);
    expect(isTrackId("1_dm")).toBe(true);
    expect(isTrackId("whitelisted_caller")).toBe(true);
    expect(isTrackId("fellows")).toBe(true);
    expect(isTrackId("1-dm")).toBe(false);
    expect(isTrackId("?phpinfo=1")).toBe(false);
  });

  it("matches `<blockHeight>_<cid>` ids", () => {
    expect(isBlockHeightCidId("1234_bafybeib2abc")).toBe(true);
    expect(isBlockHeightCidId("1234_QmYyQSo")).toBe(true);
    expect(isBlockHeightCidId("1234")).toBe(false);
    expect(isBlockHeightCidId("1234_abc-def")).toBe(false);
  });

  it("matches substrate and evm addresses", () => {
    expect(
      isAddressId("15roJ4ZrgrZam5BQWJgiGHpgp7ShFQBRNLq6qUfiNqXDZjMK"),
    ).toBe(true);
    expect(
      isAddressId("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"),
    ).toBe(true);
    expect(isAddressId("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      true,
    );
    expect(isAddressId("summary")).toBe(false);
    expect(isAddressId("0xZZ")).toBe(false);
  });

  it("matches fellowship evidence ids", () => {
    expect(isEvidenceId("QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N")).toBe(
      true,
    );
    expect(isEvidenceId("1234567")).toBe(true);
    expect(isEvidenceId("1234567-0")).toBe(true);
    expect(isEvidenceId("?phpinfo=1")).toBe(false);
  });

  it("accepts a value matching any of the validators", () => {
    const validator = anyOf(isNumericId, isBlockHeightHashId);

    expect(validator("1264")).toBe(true);
    expect(validator(`1264_${HASH}`)).toBe(true);
    expect(validator("?phpinfo=1")).toBe(false);
  });
});

describe("matchesRouteParams", () => {
  it("checks each declared param", () => {
    const validateParams = { id: isNumericId };

    expect(matchesRouteParams(validateParams, { id: "12" })).toBe(true);
    expect(matchesRouteParams(validateParams, { id: "summary" })).toBe(false);
    expect(matchesRouteParams(validateParams, {})).toBe(false);
    expect(matchesRouteParams(validateParams, undefined)).toBe(false);
  });

  it("supports a custom predicate per route", () => {
    const validateParams = (params) => params.id === "candidates";

    expect(matchesRouteParams(validateParams, { id: "candidates" })).toBe(true);
    expect(matchesRouteParams(validateParams, { id: "1" })).toBe(false);
  });

  it("checks every segment of a catch-all param", () => {
    const validateParams = { params: isNumericId };

    expect(matchesRouteParams(validateParams, { params: ["1", "2"] })).toBe(
      true,
    );
    expect(matchesRouteParams(validateParams, { params: ["1", "x"] })).toBe(
      false,
    );
    expect(matchesRouteParams(validateParams, { params: [] })).toBe(false);
  });

  it("passes the gssp context to custom predicates", () => {
    const validateParams = (params, context) => context?.query?.tab === "ok";

    expect(
      matchesRouteParams(validateParams, { id: "1" }, { query: { tab: "ok" } }),
    ).toBe(true);
    expect(matchesRouteParams(validateParams, { id: "1" }, { query: {} })).toBe(
      false,
    );
  });
});
