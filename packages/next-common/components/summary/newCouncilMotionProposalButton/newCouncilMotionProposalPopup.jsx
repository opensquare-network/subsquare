import Popup from "next-common/components/popup/wrapper/Popup";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import ForwardPopupProvider from "next-common/context/forwardPopup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useForwardPopupContext } from "next-common/context/forwardPopup";
import { ChoiceButton } from "../newProposalButton/common";
import NewPreimageSVG from "../newProposalButton/icons/new-preimage.svg";
import NewCouncilMotionProposalInnerPopup from "./newProposalInnerPopup";
import CommunityCouncilQuickStart from "./quickStart/communityCouncilQuickStart";
import CouncilQuickStart from "./quickStart/councilQuickStart";

function NewProposalPopupButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      icon={<NewPreimageSVG className="mr-1"/>}
      name="New common"
      description="Create a new proposal"
      onClick={() => {
        setForwardPopup(
          <NewCouncilMotionProposalInnerPopup isMember={isMember} />,
        );
      }}
    />
  );
}

export default function NewCouncilMotionProposalPopup({ onClose }) {
  const { isMember } = useIsCollectiveMember();

  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <Popup title="Submit Motion" onClose={onClose}>
          <div className="flex flex-col !mt-[24px] gap-[12px]">
            <NewProposalPopupButton isMember={isMember} />
          </div>
          <CommunityCouncilQuickStart isMember={isMember} />
          <CouncilQuickStart isMember={isMember} />
        </Popup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
