import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import NotePreimageButton from "../../notePreimageButton";
import useFundBountyFields from "../../fields/useFundBountyFields";
import useFundBountyPreimages from "./useFundBountyPreimages";
import ExtrinsicInfo from "../../../newPreimagePopup/info";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import ErrorInfoPanel from "next-common/components/summary/styled/errorInfoPanel";
import EstimatedGas from "next-common/components/estimatedGas";

function PopupContent() {
  const { value: bountyParams, component: bountyFields } =
    useFundBountyFields();
  const {
    notePreimageTx,
    encodedLength,
    encodedProposal,
    encodedHash,
    proposalByteLength,
    preimageExists,
    error,
  } = useFundBountyPreimages(bountyParams);
  const createPreimagesTx = preimageExists ? null : notePreimageTx;

  return (
    <>
      <SignerWithBalance />
      {bountyFields}
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      {error && <ErrorInfoPanel>{error}</ErrorInfoPanel>}
      {preimageExists && (
        <p className="text12Medium text-textTertiary">
          The metadata and proposal preimages already exist on chain.
        </p>
      )}
      <InsufficientBalanceTips byteLength={proposalByteLength} preimageOnly />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={() => createPreimagesTx} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={createPreimagesTx} />
      </div>
    </>
  );
}

export default function FundMultiAssetBountyPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Create Multi-asset Bounty Proposal" onClose={onClose}>
      <PopupContent />
    </Popup>
  );
}
