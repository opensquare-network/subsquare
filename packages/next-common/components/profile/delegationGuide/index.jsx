import DelegationGuidePanel from "./panel";
import { useDelegationGuideContext } from "./context/DelegationGuideContext";
import { isNil } from "lodash-es";

function DelegationGuideWithNullGuard({ children }) {
  const { data, isLoading } = useDelegationGuideContext();
  if (isLoading || isNil(data)) {
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
