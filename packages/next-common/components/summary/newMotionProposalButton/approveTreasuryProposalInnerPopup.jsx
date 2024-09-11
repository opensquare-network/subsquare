import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupLabel from "next-common/components/popup/label";
import Popup from "next-common/components/popup/wrapper/Popup";
import Select from "next-common/components/select";
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
  const [activeProposal, setActiveProposal] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const { value } = useAsync(async () => {
    const proposals = await api?.query?.[pallet]?.proposals?.();
    return proposals.toJSON();
  }, [api, pallet]);

  const disabled = !activeProposal;

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
        <Select
          options={[]}
          value={activeProposal}
          onChange={(option) => {
            setActiveProposal(option);
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
