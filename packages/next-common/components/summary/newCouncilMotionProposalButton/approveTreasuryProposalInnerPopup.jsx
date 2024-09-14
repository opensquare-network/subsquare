import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { StatusWrapper } from "next-common/components/popup/styled";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import nextApi from "next-common/services/nextApi";
import { isValidIntegerIndex } from "next-common/utils/isValidIntegerIndex";
import { useCallback, useEffect, useState } from "react";
import { useAsync, useDebounce } from "react-use";
import {
  useTreasuryPallet,
  useTreasuryProposalListUrl,
} from "../../../context/treasury";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import ErrorMessage from "next-common/components/styled/errorMessage";
import ExternalLink from "next-common/components/externalLink";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";

export default function ApproveTreasuryProposalInnerPopup({ onClose }) {
  const router = useRouter();
  const pallet = useCollectivePallet();
  const treasuryPallet = useTreasuryPallet();
  const api = useContextApi();

  const { members } = useCollectiveMembers();
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

  const { value: proposalDataResult, loading: loadingProposalData } =
    useTreasuryProposalData(debouncedInputProposal);

  const { value: treasuryTitle } = useTreasuryProposalTitle(
    proposalDataResult?.id,
  );

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
  treasuryTitle,
  inputProposal,
  debouncedInputProposal,
  proposalData,
}) {
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);

  if (!inputProposal) {
    return null;
  }

  let content;

  if (proposalData) {
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
      result.id = id;
      result.data = proposal.toJSON();
    }

    return result;
  }, [api, id, treasuryPallet]);
}

function useTreasuryProposalTitle(id) {
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);

  return useAsync(async () => {
    if (!id) {
      return null;
    }

    const resp = await nextApi.fetch(
      `${
        proposalListUrl.startsWith("/")
          ? proposalListUrl.slice(1)
          : proposalListUrl
      }/${id}`,
    );

    return resp?.result?.title;
  }, [id, proposalListUrl]);
}
