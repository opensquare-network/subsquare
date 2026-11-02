// Whether a chain still has the legacy treasury `Proposals`/`Approvals` flow.
//
// `spend_local` is the only call that writes `Proposals`/`Approvals`, and it
// pays approved proposals out automatically at the end of a spend period. The
// new `treasury.spend` flow stores spends in `Spends` and needs a `payout`
// claim instead. So the same flag also decides which treasury proposal popup a
// chain uses.
//
// The treasury spend interfaces below were read from the runtime metadata with
// `state_getMetadata`:
//
// - polkadot, kusama, westend, paseo (treasury on AssetHub):
//     spend_local, spend(VersionedLocatableAsset, VersionedLocatableAccount)
// - polkadot relay, kusama relay:
//     spend_local, spend(VersionedLocatableAsset, VersionedLocation)
// - acala, karura, bifrost, bifrost-polkadot, basilisk, hydradx,
//   hydradx-testnet, altair, litentry, vara, zkverify, zkverify-testnet:
//     spend_local, spend((), AccountId32)
// - acurast: spend_local, spend((), MultiAddress)
// - darwinia2: spend_local, spend((), AccountId20)
// - hyperbridge: spend_local, spend(H256, AccountId32)
// - astar, shibuya, crust: neither, only propose_spend/approve_proposal
// - collectives, westend-collectives, polkadot-people, kusama-people,
//   westend-people, kusama-coretime, interlay: no treasury pallet
// - calamari, crab, khala, kintsugi, laos, laos-testnet, litmus, phala,
//   polkadex, turing, rococo, kabocha: not verified yet, see spendForm.js
//
// The AssetHub migration is not live yet, so every chain keeps the default of
// `approvals: true`. Set `modules.treasury.approvals` to false on a chain to
// switch it to the new AssetHub spend flow.
export function hasTreasuryApprovals(settings) {
  return settings?.modules?.treasury?.approvals !== false;
}
