import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDelegationGuideContext } from "./context/delegationGuideContext";
import OpenGovDelegationInfo from "./openGovDelegationInfo";
import DemocraticDelegationInfo from "./democracyDelegationInfo";
import Divider from "next-common/components/styled/layout/divider";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

export function CommonDelegationInfoPanel({
  children,
  suffix,
  showDivider = true,
}) {
  return (
    <div className="w-full space-y-4 mt-4 flex flex-col">
      {showDivider && <Divider className="w-full" />}
      <div className="w-full inline-flex space-x-2">
        <GreyPanel className="flex-grow px-3 py-1.5 rounded-md text-textTertiary text12Medium">
          {children}
        </GreyPanel>
        {suffix}
      </div>
    </div>
  );
}

export function NoDelegationInfo() {
  return (
    <CommonDelegationInfoPanel>
      You have no delegation to this account.
    </CommonDelegationInfoPanel>
  );
}

function DelegationInfoInContext() {
  const { pallet } = useDelegationGuideContext();

  if (pallet === "referenda") {
    return <OpenGovDelegationInfo />;
  }

  return <DemocraticDelegationInfo />;
}

export default function DelegationInfo() {
  const address = useRealAddress();

  if (!address) {
    return null;
  }

  return <DelegationInfoInContext />;
}
