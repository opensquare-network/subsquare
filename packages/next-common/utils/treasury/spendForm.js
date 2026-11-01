import Chains from "next-common/utils/consts/chains";
import { hasTreasuryApprovals } from "./approvals";

// `treasury.spend(asset_kind, amount, beneficiary, valid_from)` has the same
// four arguments on every chain, but `AssetKind` and the beneficiary type are
// runtime associated types, so every combination needs its own popup. They were
// read with `state_getMetadata`:
//
// | chains                                | asset_kind              | beneficiary               |
// |---------------------------------------|-------------------------|---------------------------|
// | polkadot, kusama, westend, paseo      | VersionedLocatableAsset | VersionedLocatableAccount |
// | polkadot relay, kusama relay          | VersionedLocatableAsset | VersionedLocation         |
// | hydradx, hydradx-testnet, bifrost,    |                         |                           |
// | bifrost-polkadot, acala, karura,      | ()                      | AccountId32               |
// | centrifuge, altair, darwinia2, vara,  |                         |                           |
// | zkverify, litentry                    |                         |                           |
// | acurast                               | ()                      | MultiAddress              |
// | moonbeam, moonriver                   | NativeOrWithId          | AccountId20               |
// | ajuna                                 | NativeOrWithId          | AccountId32               |
// | hyperbridge                           | H256                    | AccountId32               |
//
// A chain that still has approvals keeps using `spend_local(amount,
// beneficiary)`, which has no asset kind at all.
export const TREASURY_SPEND_FORMS = {
  // spend_local(amount, beneficiary)
  spendLocal: "spendLocal",
  // spend(VersionedLocatableAsset, amount, VersionedLocatableAccount, validFrom)
  locatableAccount: "locatableAccount",
  // spend((), amount, account, validFrom)
  unitAsset: "unitAsset",
  // asset kinds without a popup yet: VersionedLocation, NativeOrWithId, H256
  unsupported: "unsupported",
};

const spendFormByChain = {
  [Chains.polkadot]: TREASURY_SPEND_FORMS.locatableAccount,
  [Chains.kusama]: TREASURY_SPEND_FORMS.locatableAccount,
  [Chains.westend]: TREASURY_SPEND_FORMS.locatableAccount,
  [Chains.paseo]: TREASURY_SPEND_FORMS.locatableAccount,
  [Chains.moonbeam]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.moonriver]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.ajuna]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.hyperBridge]: TREASURY_SPEND_FORMS.unsupported,
};

// While a chain keeps `modules.treasury.approvals`, the legacy spend_local form
// is used. Once it is switched off, the form is the one detected for the chain.
export function getTreasurySpendForm(chain, settings) {
  if (hasTreasuryApprovals(settings)) {
    return TREASURY_SPEND_FORMS.spendLocal;
  }

  return spendFormByChain[chain] ?? TREASURY_SPEND_FORMS.unitAsset;
}
