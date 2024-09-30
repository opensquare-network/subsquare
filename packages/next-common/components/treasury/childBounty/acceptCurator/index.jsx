import { useOnchainData } from "next-common/context/post";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";

export default function ChildBountyAcceptCurator() {
  const address = useRealAddress();
  const onchainData = useOnchainData();
  const { parentBountyId, index: childBountyId } = onchainData;
  const { result, loading } = useSubStorage("childBounties", "childBounties", [
    parentBountyId,
    childBountyId,
  ]);
  const status = result?.toJSON() || {};
  const curatorProposed = status.curatorProposed || {};
  const { curator } = curatorProposed;

  const { showPopup, component } = useAcceptCuratorPopup();

  if (loading || curator !== address) {
    return null;
  }

  return (
    <div>
      <PrimaryButton
        className="w-full"
        onClick={() => {
          showPopup();
        }}
      >
        Accept Curator
      </PrimaryButton>

      {component}
    </div>
  );
}
