import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import { useCallback, useState } from "react";
import { useAsync } from "react-use";

export default function ApproveTreasuryProposalInnerPopup({
  onClose,
  onSubmitted,
}) {
  const api = useContextApi();
  const pallet = useCollectivePallet();
  const [inputProposal, setInputProposal] = useState("");

  // FIXME: council proposal, fetch proposals
  // eslint-disable-next-line no-unused-vars
  const { value: proposals, loading } = useAsync(async () => {
    if (!api) {
      return [];
    }

    const proposalHashes = await api?.query?.[pallet]?.proposals?.();
    const proposalsWithDetails = await Promise.all(
      proposalHashes.map(async (hash) => {
        const proposal = await api.query[pallet].proposalOf(hash);
        return {
          hash: hash.toHex(),
          proposal: proposal.toJSON(),
        };
      }),
    );

    return proposalsWithDetails;
  }, [api, pallet]);

  const disabled = !inputProposal || loading;

  const getTxFunc = useCallback(() => {}, []);

  return (
    <Popup
      className="!w-[640px]"
      title="Approve Treasury Proposal"
      maskClosable={false}
      onClose={onClose}
    >
      <SignerWithBalance />

      <div>
        <PopupLabel text="Proposal" />
        <Input
          value={inputProposal}
          onChange={(e) => setInputProposal(e.target.value)}
        />
      </div>

      <TxSubmissionButton
        // TODO: council proposal, only collective member can do
        disabled={disabled}
        getTxFunc={getTxFunc}
        onInBlock={() => {
          onSubmitted?.();
        }}
        // TODO: council proposal, onFinalized
        onClose={onClose}
      />
    </Popup>
  );
}
