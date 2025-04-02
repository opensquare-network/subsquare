import DelegationGuidePanel from "./panel";
import { useDelegationGuideContext } from "./context/delegationGuideContext";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

function DelegationGuideWithNullGuard({ children }) {
  const { data, isLoading } = useDelegationGuideContext();
  const realAddress = useRealAddress();
  const profileAddress = useProfileAddress();

  if (
    realAddress === profileAddress ||
    isLoading ||
    isNil(data) ||
    (isNil(data?.longDescription) && isNil(data?.shortDescription))
  ) {
    return null;
  }

  return children;
}

export default function DelegationGuide() {
  return (
    <div className="mt-6">
      <DelegationGuideWithNullGuard>
        <DelegationGuidePanel />
      </DelegationGuideWithNullGuard>
    </div>
  );
}
