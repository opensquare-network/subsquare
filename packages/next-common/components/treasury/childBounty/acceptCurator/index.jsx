import PrimaryButton from "next-common/lib/button/primary";
import { useAcceptCuratorPopup } from "./useAcceptCuratorPopup";
import { usePostState } from "next-common/context/post";

export default function ChildBountyAcceptCurator() {
  const postState = usePostState();
  const { showPopup, component } = useAcceptCuratorPopup();

  // TODO: accept_curator, the bounty state should be `active`
  if (postState !== "CuratorProposed") {
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
