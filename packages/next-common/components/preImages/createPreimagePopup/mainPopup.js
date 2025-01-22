import Popup from "next-common/components/popup/wrapper/Popup";
import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import NewPreimageSVG from "next-common/components/summary/newProposalButton/icons/new-preimage.svg";
import { useForwardPopupContext } from "next-common/context/forwardPopup";
import { NewPreimageInnerPopup } from "../newPreimagePopup";

function NewPreimageButton() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      icon={<NewPreimageSVG className="mr-1" />}
      name="New preimage"
      description="Create a new preimage"
      onClick={() => setForwardPopup(<NewPreimageInnerPopup />)}
    />
  );
}

export default function MainPopup({ onClose, children }) {
  return (
    <Popup title="New Preimage" onClose={onClose}>
      <div className="flex flex-col !mt-[24px] gap-[16px]">
        <NewPreimageButton />
      </div>
      {children}
    </Popup>
  );
}
