import { useCallback } from "react";
import { NewProposalInnerPopup } from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import { NewPreimageButton, NewProposalFromPreimageButton } from "./common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";
import Popup from "next-common/components/popup/wrapper/Popup";
import { NewPreimageInnerPopup } from "next-common/components/preImages/newPreimagePopup";
import ReferendaProposalQuickStart from "./referendaProposalQuickStart";

function NewPreimage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();

  const onPreimageCreated = useCallback(
    (hash, length) => {
      setForwardPopup(
        <NewProposalInnerPopup
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
      onClick={() => setForwardPopup(<NewProposalInnerPopup track={period} />)}
    />
  );
}

export default function SubmitProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <Popup title="Submit Proposal" onClose={onClose}>
          <div className="flex flex-col !mt-[24px] gap-[12px]">
            <NewPreimage />
            <NewProposalFromPreImage />
          </div>
          <ReferendaProposalQuickStart />
        </Popup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
