import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import nextApi from "next-common/services/nextApi";
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

  // FIXME: council proposal, fetch proposal from on-chain
  // eslint-disable-next-line no-unused-vars
  const { loading, value: proposalData } = useAsync(async () => {
    if (!api || !debouncedInputProposal) {
      return null;
    }
    const { result: proposal } = await nextApi.fetch(
      `community-council/motions/${debouncedInputProposal}`,
    );
    return proposal;
  }, [api, debouncedInputProposal]);

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
          onChange={(e) => {
            setInputProposal(e.target.value);
          }}
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
