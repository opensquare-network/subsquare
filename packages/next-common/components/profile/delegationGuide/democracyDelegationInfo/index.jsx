import { NoDelegationInfo, CommonDelegationInfoPanel } from "../delegationInfo";
import useSubDemocracyDelegating from "next-common/utils/hooks/referenda/useSubDemocracyDelegating";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function DemocracyDelegationInfo() {
  const realAddress = useRealAddress();
  const { delegating, isLoading } = useSubDemocracyDelegating(realAddress);
  if (isLoading) {
    return null;
  }

  if (delegating?.length === 0) {
    return <NoDelegationInfo />;
  }

  // TODO: democracy delegation info
  return (
    <CommonDelegationInfoPanel>
      DemocracyDelegationInfo
    </CommonDelegationInfoPanel>
  );
}
