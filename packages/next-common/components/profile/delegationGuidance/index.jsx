import DelegationGuidancePanel from "./panel";
import { useDelegationGuidanceContext } from "./context/delegationGuidanceContext";
import { isNil } from "lodash-es";

function DelegationGuidanceWithNullGuard({ children }) {
  const { data, isLoading } = useDelegationGuidanceContext();
  if (isLoading || isNil(data)) {
    return null;
  }

  return children;
}

export default function DelegationGuidance() {
  return (
    <div className="mt-6">
      <DelegationGuidanceWithNullGuard>
        <DelegationGuidancePanel />
      </DelegationGuidanceWithNullGuard>
    </div>
  );
}
