import { describe, expect, it } from "vitest";
import { TypeRegistry } from "@polkadot/types";
import { getCuratorDeposit, getUnassignAction } from "./actions";

const parent = "parent-curator";
const child = "child-curator";
const status = (type, curator = child) => ({ type, value: { curator } });
const parentStatus = status("Active", parent);

describe("getUnassignAction", () => {
  it("allows a proposed curator to decline and an active curator to resign", () => {
    expect(getUnassignAction({ status: status("Funded") })).toEqual({
      origin: child,
      label: "Decline curator role",
      depositEffect: null,
    });
    expect(
      getUnassignAction({ status: status("Active"), isChild: true }),
    ).toEqual({
      origin: child,
      label: "Resign as curator",
      depositEffect: "returned",
    });
    expect(
      getUnassignAction({ status: status("Funded"), isChild: true }).label,
    ).toBe("Decline");
  });

  it("allows only an active parent curator to remove a distinct child curator", () => {
    expect(
      getUnassignAction({
        status: status("Funded"),
        parentStatus,
        isChild: true,
        remove: true,
      }),
    ).toEqual({
      origin: parent,
      label: "Remove proposed curator",
      depositEffect: null,
    });
    expect(
      getUnassignAction({
        status: status("Active"),
        parentStatus,
        isChild: true,
        remove: true,
      }),
    ).toEqual({
      origin: parent,
      label: "Remove child curator",
      depositEffect: "burned",
    });
    for (const type of ["Funded", "CuratorUnassigned"]) {
      expect(
        getUnassignAction({
          status: status("Active"),
          parentStatus: status(type, parent),
          isChild: true,
          remove: true,
        }),
      ).toBeNull();
    }
    expect(
      getUnassignAction({
        status: status("Active", parent),
        parentStatus,
        isChild: true,
        remove: true,
      }),
    ).toBeNull();
    expect(
      getUnassignAction({
        status: status("Active"),
        parentStatus,
        remove: true,
      }),
    ).toBeNull();
  });

  it("does not offer actions in other states or without a curator", () => {
    for (const type of [
      "FundingAttempted",
      "CuratorUnassigned",
      "PayoutAttempted",
    ]) {
      expect(getUnassignAction({ status: status(type) })).toBeNull();
    }
    expect(getUnassignAction({ status: status("Active", null) })).toBeNull();
    expect(getUnassignAction({})).toBeNull();
  });
});

describe("getCuratorDeposit", () => {
  const registry = new TypeRegistry();

  it("reads exact balances from the runtime consideration and absent deposits", () => {
    const option = registry.createType("Option<(u128,Null)>", [
      "12345000000000000000",
      null,
    ]);
    expect(getCuratorDeposit(option)).toBe("12345000000000000000");
    expect(
      getCuratorDeposit(registry.createType("Option<(u128,Null)>", null)),
    ).toBe("0");
    expect(getCuratorDeposit(registry.createType("Option<u128>", "42"))).toBe(
      "42",
    );
  });

  it("rejects an unrecognized consideration instead of guessing", () => {
    expect(() =>
      getCuratorDeposit({ isNone: false, unwrap: () => ({}) }),
    ).toThrow("Unrecognized curator deposit format");
  });
});
