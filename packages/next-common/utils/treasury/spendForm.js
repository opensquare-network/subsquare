import Chains from "next-common/utils/consts/chains";
import { hasTreasuryApprovals } from "./approvals";

// How a chain creates a treasury proposal. `treasury.spend` always takes
// `(asset_kind, amount, beneficiary, valid_from)`, but `AssetKind` and the
// beneficiary type are runtime associated types, so every combination needs its
// own popup.
export const TREASURY_SPEND_FORMS = {
  // spend_local(amount, beneficiary). The legacy flow: the proposal is stored in
  // `Proposals`/`Approvals` and paid out at the end of a spend period.
  spendLocal: "spendLocal",
  // spend(VersionedLocatableAsset, amount, VersionedLocatableAccount, validFrom)
  // The treasury lives on AssetHub and pays an asset located on another chain.
  locatableAccount: "locatableAccount",
  // spend((), amount, account, validFrom). The treasury pays the chain native
  // asset, so `asset_kind` is the unit type. polkadot-js encodes an address to
  // AccountId32, AccountId20 and MultiAddress alike, so one popup is enough.
  unitAsset: "unitAsset",
  // No treasury spend call, or an asset kind that has no popup yet.
  unsupported: "unsupported",
};

// Read from the runtime metadata with `state_getMetadata`. Every chain that has
// `treasury.spend` also has `treasury.spend_local`, so the legacy flow is always
// available and only the new one has to be classified per chain.
const spendFormByChain = {
  // spend(VersionedLocatableAsset, ..., VersionedLocatableAccount, ...), read
  // from the AssetHub endpoints these sites connect to.
  [Chains.polkadot]: TREASURY_SPEND_FORMS.locatableAccount,
  [Chains.kusama]: TREASURY_SPEND_FORMS.locatableAccount,
  [Chains.westend]: TREASURY_SPEND_FORMS.locatableAccount,
  [Chains.paseo]: TREASURY_SPEND_FORMS.locatableAccount,

  // spend((), ..., <account>, ...) on chains that enabled the new treasury.
  [Chains.acala]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.karura]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.bifrost]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.bifrostPolkadot]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.basilisk]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.hydradx]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.hydradxTestnet]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.altair]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.darwinia2]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.litentry]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.vara]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.zkverify]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.zkverifyTestnet]: TREASURY_SPEND_FORMS.unitAsset,
  [Chains.acurast]: TREASURY_SPEND_FORMS.unitAsset,

  // spend(H256, ..., AccountId32, ...), the asset kind is an asset id that no
  // popup handles yet.
  [Chains.hyperBridge]: TREASURY_SPEND_FORMS.unsupported,

  // Only `propose_spend`/`approve_proposal`, there is no spend call at all.
  [Chains.astar]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.shibuya]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.crust]: TREASURY_SPEND_FORMS.unsupported,

  // No treasury pallet.
  [Chains.collectives]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.westendCollectives]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.polkadotPeople]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.kusamaPeople]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.westendPeople]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.kusamaCoretime]: TREASURY_SPEND_FORMS.unsupported,
  [Chains.interlay]: TREASURY_SPEND_FORMS.unsupported,
};

// While a chain keeps `modules.treasury.approvals`, the legacy spend_local form
// is used, which is the only call writing `Proposals`/`Approvals`. Once it is
// switched off, the form is the one read from the metadata above.
//
// A chain that is not listed above gets no popup instead of a call that would
// fail. Still to verify before switching them: calamari, crab, khala, kintsugi,
// laos, laos-testnet, litmus, phala, polkadex, turing, rococo, kabocha, and the
// AssetHub sites themselves (polkadot-assethub, kusama-assethub,
// westend-assethub, paseo-assethub), whose treasury is governed from the relay
// chain site.
export function getTreasurySpendForm(chain, settings) {
  if (hasTreasuryApprovals(settings)) {
    return TREASURY_SPEND_FORMS.spendLocal;
  }

  return spendFormByChain[chain] ?? TREASURY_SPEND_FORMS.unsupported;
}
