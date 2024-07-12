import AddressComboField from "next-common/components/popup/fields/addressComboField";
import BalanceField from "next-common/components/popup/fields/balanceField";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { usePageProps } from "next-common/context/page";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import AutoSelectTreasuryTrack from "next-common/components/popup/fields/autoSelectTreasuryTrack";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useLocalTreasuryNotePreimageTx } from "next-common/components/preImages/submitPreimagePopup/newLocalTreasuryProposalPopup";

export function NewTreasuryReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { tracks } = usePageProps();
  const [inputBalance, setInputBalance] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = useTrackDetail(trackId);
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();
  const [enactment, setEnactment] = useState();

  const { encodedHash, encodedLength, notePreimageTx } =
    useLocalTreasuryNotePreimageTx(inputBalance, beneficiary);

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose} wide>
      <SignerWithBalance title="Origin" />
      <BalanceField
        title="Request"
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
      />
      <AddressComboField
        title="Beneficiary"
        extensionAccounts={extensionAccounts}
        defaultAddress={realAddress}
        setAddress={setBeneficiary}
      />
      <AutoSelectTreasuryTrack
        requestAmount={inputBalance}
        trackId={trackId}
        setTrackId={setTrackId}
      />
      <AdvanceSettings>
        <EnactmentBlocks track={track} setEnactment={setEnactment} />
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateProposalSubmitButton
          trackId={trackId}
          enactment={enactment}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          notePreimageTx={notePreimageTx}
        />
      </div>
    </Popup>
  );
}
