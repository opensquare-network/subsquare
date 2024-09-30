import PrimaryButton from "next-common/lib/button/primary";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";
import { useOnchainData, usePostState } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function ChildBountyAcceptCurator() {
  const address = useRealAddress();
  const onchainData = useOnchainData();
  const { curator } = onchainData || {};
  const postState = usePostState();
  const { showPopup, component } = useAcceptCuratorPopup();

  if (curator !== address && postState !== "CuratorProposed") {
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
