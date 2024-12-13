import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import ForwardPopupProvider from "next-common/context/forwardPopup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useForwardPopupContext } from "next-common/context/forwardPopup";
import { ChoiceButton } from "../newProposalButton/common";
import NewPreimageSVG from "../newProposalButton/icons/new-preimage.svg";
import NewCouncilMotionProposalInnerPopup from "./newProposalInnerPopup";
import {
  ShibuyaCommunityCouncilQuickStart,
  ShibuyaCouncilQuickStart,
} from "./common/shibuyaQuickStart";

function NewProposalPopupButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      icon={<NewPreimageSVG />}
      name="New common"
      description="Create a new proposal"
      onClick={() => {
        setForwardPopup(
          <NewCouncilMotionProposalInnerPopup
            onClose={onClose}
            isMember={isMember}
          />,
        );
      }}
    />
  );
}

export default function NewCouncilMotionProposalPopup() {
  const { onClose } = usePopupParams();
  const { isMember } = useIsCollectiveMember();

  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <Popup
          wide
          className="!w-[640px]"
          title="Submit Motion"
          onClose={onClose}
        >
          <div className="flex flex-col !mt-[24px] gap-[12px]">
            <NewProposalPopupButton onClose={onClose} isMember={isMember} />
          </div>
          <ShibuyaCommunityCouncilQuickStart
            onClose={onClose}
            isMember={isMember}
          />
          <ShibuyaCouncilQuickStart onClose={onClose} isMember={isMember} />
        </Popup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
