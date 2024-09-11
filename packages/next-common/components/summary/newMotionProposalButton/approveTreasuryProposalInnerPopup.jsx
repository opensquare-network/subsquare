import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { useCallback, useState } from "react";
import { useAsync, useDebounce } from "react-use";

export default function ApproveTreasuryProposalInnerPopup({
  onClose,
  onSubmitted,
}) {
  const api = useContextApi();
  const [inputProposal, setInputProposal] = useState("");
  const [debouncedInputProposal, setDebouncedInputProposal] = useState("");
  useDebounce(
    () => {
      setDebouncedInputProposal(inputProposal);
    },
    300,
    [inputProposal],
  );

  const { loading, value: proposalData } = useAsync(async () => {
    if (!api || !debouncedInputProposal) {
      return null;
    }

    const proposal = await api.query.treasury.proposals(debouncedInputProposal);

    if (!proposal.isSome) {
      return null;
    }

    return proposal.toJSON();
  }, [api, debouncedInputProposal]);

  const disabled = !inputProposal || loading || !proposalData;

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
          onChange={(e) => {
            setInputProposal(e.target.value);
          }}
        />
      </div>

      <TxSubmissionButton
        // TODO: council proposal, only collective member can do
        disabled={disabled}
        loading={loading}
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
