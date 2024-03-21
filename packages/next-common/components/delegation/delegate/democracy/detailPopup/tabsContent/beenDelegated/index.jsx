import useBeenDelegated from "next-common/hooks/useBeenDelegated";
import DelegationTabList from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListPopup/delegationTabList";

export default function DemocracyDelegateeDetailPopupBeenDelegated({
  delegate,
}) {
  const { beenDelegatedList } = useBeenDelegated(delegate.address);

  return <DelegationTabList beenDelegatedList={beenDelegatedList} />;
}
