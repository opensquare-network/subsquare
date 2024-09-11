import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { StatusWrapper } from "next-common/components/popup/styled";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import nextApi from "next-common/services/nextApi";
import { isValidIntegerIndex } from "next-common/utils/isValidIntegerIndex";
import Link from "next/link";
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
    500,
    [inputProposal],
  );

  const { loading, value: proposalData } = useAsync(async () => {
    if (
      !api ||
      !debouncedInputProposal ||
      !isValidIntegerIndex(debouncedInputProposal)
    ) {
      return null;
    }

    const proposal = await api.query.treasury.proposals(debouncedInputProposal);

    if (!proposal.isSome) {
      return null;
    }

    return proposal.toJSON();
  }, [api, debouncedInputProposal]);

  const { loading: loadingTreasuryTitle, value: treasuryTitle } =
    useAsync(async () => {
      if (proposalData) {
        const { result } = await nextApi.fetch(
          `treasury/proposals/${debouncedInputProposal}`,
        );
        if (result?.title) {
          return result.title;
        }
      }
    }, [proposalData, debouncedInputProposal]);

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

        {!loadingTreasuryTitle && treasuryTitle && (
          <StatusWrapper className="mt-2">
            <Link
              className="cursor-pointer hover:underline"
              target="_blank"
              href={`/treasury/proposals/${debouncedInputProposal}`}
              rel="noreferrer"
            >
              {treasuryTitle}
            </Link>
          </StatusWrapper>
        )}
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
