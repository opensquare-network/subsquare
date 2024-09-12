import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { StatusWrapper } from "next-common/components/popup/styled";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import nextApi from "next-common/services/nextApi";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import { isValidIntegerIndex } from "next-common/utils/isValidIntegerIndex";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAsync, useDebounce } from "react-use";
import {
  useTreasuryPallet,
  useTreasuryProposalListUrl,
} from "../../../context/treasury";

export default function ApproveTreasuryProposalInnerPopup({ onClose }) {
  const pallet = useCollectivePallet();
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);
  const api = useContextApi();

  const members = useCouncilMembers();
  const threshold = Math.ceil(members?.length / 2) + 1;

  const [inputProposal, setInputProposal] = useState("");
  const [debouncedInputProposal, setDebouncedInputProposal] = useState("");
  useEffect(() => {
    if (!inputProposal) {
      setDebouncedInputProposal("");
    }
  }, [inputProposal]);
  useDebounce(
    () => {
      if (inputProposal) {
        setDebouncedInputProposal(inputProposal);
      }
    },
    500,
    [inputProposal],
  );

  const { loading: loadingProposalData, value: proposalData } =
    useAsync(async () => {
      if (
        !api ||
        !debouncedInputProposal ||
        !isValidIntegerIndex(debouncedInputProposal)
      ) {
        return null;
      }

      const proposal = await api.query[treasuryPallet].proposals(
        debouncedInputProposal,
      );

      if (!proposal.isSome) {
        return null;
      }

      return proposal.toJSON();
    }, [api, debouncedInputProposal, treasuryPallet]);

  const { loading: loadingTreasuryTitle, value: treasuryTitle } =
    useAsync(async () => {
      if (loadingProposalData || !debouncedInputProposal || !proposalData) {
        return;
      }

      const resp = await nextApi.fetch(
        `${
          proposalListUrl.startsWith("/")
            ? proposalListUrl.slice(1)
            : proposalListUrl
        }/${debouncedInputProposal}`,
      );
      return resp?.result?.title;
    }, [
      proposalData,
      debouncedInputProposal,
      loadingProposalData,
      proposalListUrl,
    ]);

  const disabled = !inputProposal || loadingProposalData || !proposalData;

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    const proposal = api.tx[treasuryPallet].approveProposal(
      debouncedInputProposal,
    );
    const proposalLength = proposal?.encodedLength || 0;

    const params =
      api.tx[pallet].propose.meta.args.length === 3
        ? [threshold, proposal, proposalLength]
        : [threshold, proposal];

    return api.tx[pallet].propose(...params);
  }, [api, debouncedInputProposal, pallet, threshold, treasuryPallet]);

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
              href={`${proposalListUrl}/${debouncedInputProposal}`}
              rel="noreferrer"
            >
              {treasuryTitle}
            </Link>
          </StatusWrapper>
        )}
      </div>

      <TxSubmissionButton
        disabled={disabled}
        loading={loadingProposalData}
        getTxFunc={getTxFunc}
        onInBlock={() => {
          // TODO: council proposal, trigger list update?
        }}
        onClose={onClose}
      />
    </Popup>
  );
}
