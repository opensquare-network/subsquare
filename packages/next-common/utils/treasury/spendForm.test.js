import { describe, expect, it } from "vitest";
import Chains from "next-common/utils/consts/chains";
import { TREASURY_SPEND_FORMS, getTreasurySpendForm } from "./spendForm";

const approvalsOff = { modules: { treasury: { approvals: false } } };

describe("getTreasurySpendForm", () => {
  it("uses spend_local while the chain keeps approvals", () => {
    for (const chain of [Chains.polkadot, Chains.hydradx, Chains.hyperBridge]) {
      expect(getTreasurySpendForm(chain, {})).toBe(
        TREASURY_SPEND_FORMS.spendLocal,
      );
      expect(
        getTreasurySpendForm(chain, {
          modules: { treasury: { approvals: true } },
        }),
      ).toBe(TREASURY_SPEND_FORMS.spendLocal);
    }
  });

  it("uses the detected spend form without approvals", () => {
    expect(getTreasurySpendForm(Chains.polkadot, approvalsOff)).toBe(
      TREASURY_SPEND_FORMS.locatableAccount,
    );
    expect(getTreasurySpendForm(Chains.kusama, approvalsOff)).toBe(
      TREASURY_SPEND_FORMS.locatableAccount,
    );
    expect(getTreasurySpendForm(Chains.hydradx, approvalsOff)).toBe(
      TREASURY_SPEND_FORMS.unitAsset,
    );
    expect(getTreasurySpendForm(Chains.bifrost, approvalsOff)).toBe(
      TREASURY_SPEND_FORMS.unitAsset,
    );
  });

  it("has no popup for asset kinds that are not implemented", () => {
    expect(getTreasurySpendForm(Chains.hyperBridge, approvalsOff)).toBe(
      TREASURY_SPEND_FORMS.unsupported,
    );
    expect(getTreasurySpendForm(Chains.moonbeam, approvalsOff)).toBe(
      TREASURY_SPEND_FORMS.unsupported,
    );
  });
});
