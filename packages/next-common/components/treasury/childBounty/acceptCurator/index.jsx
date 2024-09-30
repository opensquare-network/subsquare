import PrimaryButton from "next-common/lib/button/primary";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";
import { useOnchainData } from "next-common/context/post";

export default function ChildBountyAcceptCurator() {
  const onchainData = useOnchainData();
  const { showPopup, component } = useAcceptCuratorPopup();

  // TODO: accept_curator, the bounty state should be `active`
  if (onchainData.state?.state !== "CuratorProposed") {
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
