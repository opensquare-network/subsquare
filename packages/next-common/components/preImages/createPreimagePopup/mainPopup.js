import Popup from "next-common/components/popup/wrapper/Popup";
import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import NewPreimageSVG from "next-common/components/summary/newProposalButton/icons/new-preimage.svg";

export default function MainPopup({ setShowNewPreimage, onClose, children }) {
  return (
    <Popup title="New Preimage" onClose={onClose}>
      <div className="flex flex-col !mt-[24px] gap-[16px]">
        <ChoiceButton
          icon={<NewPreimageSVG />}
          name="New preimage"
          description="Create a new preimage"
          onClick={() => setShowNewPreimage(true)}
        />
      </div>
      {children}
    </Popup>
  );
}
