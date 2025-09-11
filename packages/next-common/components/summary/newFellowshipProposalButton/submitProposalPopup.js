import { useCallback } from "react";
import { NewFellowshipProposalInnerPopup } from "../newFellowshipProposalPopup";
import {
  NewPreimageButton,
  NewProposalFromPreimageButton,
} from "../newProposalButton/common";
import { usePageProps } from "next-common/context/page";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";
import { NewPreimageInnerPopup } from "next-common/components/preImages/newPreimagePopup";
import Popup from "next-common/components/popup/wrapper/Popup";
import CollectivesProposalQuickStart from "./collectivesQuickStart";

function NewPreimage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();

  const onPreimageCreated = useCallback(
    (hash, length) => {
      setForwardPopup(
        <NewFellowshipProposalInnerPopup
          track={period}
          preimageHash={hash}
          preimageLength={length}
        />,
      );
    },
    [period, setForwardPopup],
  );

  return (
    <NewPreimageButton
      onClick={() =>
        setForwardPopup(<NewPreimageInnerPopup onCreated={onPreimageCreated} />)
      }
    />
  );
}

function NewProposalFromPreImage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <NewProposalFromPreimageButton
      onClick={() =>
        setForwardPopup(<NewFellowshipProposalInnerPopup track={period} />)
      }
    />
  );
}

export default function SubmitFellowshipProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <Popup title="Submit Proposal" onClose={onClose}>
          <div className="flex flex-col !mt-[24px] gap-[12px]">
            <NewPreimage />
            <NewProposalFromPreImage />
          </div>
          <CollectivesProposalQuickStart />
        </Popup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
