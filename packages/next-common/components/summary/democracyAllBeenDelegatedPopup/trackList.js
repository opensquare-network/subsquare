import DelegationList from "../democracyBeenDelegated/beenDelegatedListPopup/delegationList";

export default function AllBeenDelegatedPopupTrackList({
  loading = false,
  items,
}) {
  return (
    <>
      {/* TODO: add summary */}
      <DelegationList loading={loading} items={items} />
    </>
  );
}
