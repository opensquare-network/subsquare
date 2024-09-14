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
import { useCallback, useState } from "react";
import { useAsync, useDebounce } from "react-use";
import {
  useTreasuryPallet,
  useTreasuryProposalListUrl,
} from "../../../context/treasury";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import ErrorMessage from "next-common/components/styled/errorMessage";
import ExternalLink from "next-common/components/externalLink";

export default function ApproveTreasuryProposalInnerPopup({ onClose }) {
  const router = useRouter();
  const pallet = useCollectivePallet();
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);
  const api = useContextApi();

  const members = useCouncilMembers();
  const threshold = Math.ceil(members?.length / 2) + 1;

  const [inputProposal, setInputProposal] = useState("");
  const [debouncedInputProposal, setDebouncedInputProposal] = useState("");

  useDebounce(
    () => {
      setDebouncedInputProposal(inputProposal);
    },
    500,
    [inputProposal],
  );
  const { value: proposalDataResult, loading: loadingProposalData } =
    useTreasuryProposalData(debouncedInputProposal);

  const { loading: loadingTreasuryTitle, value: treasuryTitle } =
    useAsync(async () => {
      if (
        loadingProposalData ||
        !debouncedInputProposal ||
        !proposalDataResult?.data
      ) {
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
      proposalDataResult?.data,
      debouncedInputProposal,
      loadingProposalData,
      proposalListUrl,
    ]);

  const disabled = !inputProposal || loadingProposalData || !proposalDataResult;

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

        {proposalDataResult && (
          <ProposalInfo
            loadingProposalData={loadingProposalData}
            loadingTreasuryTitle={loadingTreasuryTitle}
            treasuryTitle={treasuryTitle}
            inputProposal={inputProposal}
            debouncedInputProposal={debouncedInputProposal}
            proposalData={proposalDataResult.data}
          />
        )}
      </div>

      <TxSubmissionButton
        disabled={disabled}
        loading={loadingProposalData}
        getTxFunc={getTxFunc}
        onInBlock={(events) => {
          const eventData = getEventData(events, pallet, "Proposed");
          if (!eventData) {
            return;
          }

          const [, proposalIndex] = eventData;
          router.push(`${router.pathname}/${proposalIndex}`);
        }}
        onClose={onClose}
      />
    </Popup>
  );
}

function ProposalInfo({
  loadingProposalData,
  treasuryTitle,
  debouncedInputProposal,
  proposalData,
}) {
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);

  const hasProposalData = proposalData && !loadingProposalData;

  if (!debouncedInputProposal || loadingProposalData) {
    return null;
  }

  let content;

  if (hasProposalData) {
    if (treasuryTitle) {
      content = (
        <StatusWrapper className="mt-2">
          <ExternalLink
            className="hover:!underline text-textPrimary"
            externalIcon={false}
            href={`${proposalListUrl}/${debouncedInputProposal}`}
          >
            {treasuryTitle}
          </ExternalLink>
        </StatusWrapper>
      );
    }
  } else {
    content = (
      <ErrorMessage className="!mt-2">
        Can not find a treasury proposal with id {debouncedInputProposal}
      </ErrorMessage>
    );
  }

  return content;
}

function useTreasuryProposalData(id) {
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();

  return useAsync(async () => {
    if (!api || !id || !isValidIntegerIndex(id)) {
      return null;
    }

    const result = {};
    const proposal = await api.query[treasuryPallet].proposals(id);

    if (proposal.isSome) {
      result.data = proposal.toJSON();
    }

    return result;
  }, [api, id, treasuryPallet]);
}
