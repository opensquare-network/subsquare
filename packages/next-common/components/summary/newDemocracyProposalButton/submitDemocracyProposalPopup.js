import { useCallback } from "react";
import { NewDemocracyProposalInnerPopup } from "../newDemocracyProposalPopup";
import {
  NewPreimageButton,
  NewProposalFromPreimageButton,
} from "../newProposalButton/common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";
import { AjunaDemocracyProposalQuickStart } from "./ajuna/quickStart";
import Popup from "next-common/components/popup/wrapper/Popup";
import { NewPreimageInnerPopup } from "next-common/components/preImages/newPreimagePopup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

function NewPreimage() {
  const { setForwardPopup } = useForwardPopupContext();

  const onPreimageCreated = useCallback(
    (hash, length) => {
      setForwardPopup(
        <NewDemocracyProposalInnerPopup
          preimageHash={hash}
          preimageLength={length}
        />,
      );
    },
    [setForwardPopup],
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
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <NewProposalFromPreimageButton
      onClick={() => setForwardPopup(<NewDemocracyProposalInnerPopup />)}
    />
  );
}

export function SubmitDemocracyProposalInnerPopup({ children }) {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Submit Proposal" onClose={onClose}>
      <div className="flex flex-col !mt-[24px] gap-[12px]">
        <NewPreimage />
        <NewProposalFromPreImage />
      </div>
      {children}
    </Popup>
  );
}

export default function SubmitDemocracyProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <SubmitDemocracyProposalInnerPopup>
          <AjunaDemocracyProposalQuickStart />
        </SubmitDemocracyProposalInnerPopup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
