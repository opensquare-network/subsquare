import { isNil, orderBy } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import ExternalLink from "next-common/components/externalLink";
import PopupLabel from "next-common/components/popup/label";
import { StatusWrapper } from "next-common/components/popup/styled";
import Popup from "next-common/components/popup/wrapper/Popup";
import Select from "next-common/components/select";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import nextApi from "next-common/services/nextApi";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useAsync } from "react-use";
import {
  useTreasuryPallet,
  useTreasuryProposalListUrl,
} from "../../../context/treasury";
import Tooltip from "next-common/components/tooltip";

export default function ApproveTreasuryProposalInnerPopup({
  onClose,
  isMember,
}) {
  const router = useRouter();
  const pallet = useCollectivePallet();
  const treasuryPallet = useTreasuryPallet();
  const api = useContextApi();

  const { members } = useCollectiveMembers();
  const threshold = Math.ceil(members?.length / 2) + 1;

  const [selectedID, setSelectedID] = useState();

  const { value: proposalIDs, loading: loadingProposalIDs } =
    useTreasuryProposalIDs();

  const disabled =
    isNil(selectedID) ||
    loadingProposalIDs ||
    !proposalIDs?.length ||
    !isMember;

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    const proposal = api.tx[treasuryPallet].approveProposal(selectedID);
    const proposalLength = proposal?.encodedLength || 0;

    const params =
      api.tx[pallet].propose.meta.args.length === 3
        ? [threshold, proposal, proposalLength]
        : [threshold, proposal];

    return api.tx[pallet].propose(...params);
  }, [api, selectedID, pallet, threshold, treasuryPallet]);

  return (
    <Popup
      className="!w-[640px]"
      title="Approve Treasury Proposal"
      maskClosable={false}
      onClose={onClose}
    >
      <SignerWithBalance />

      <div>
        <PopupLabel text="Proposal ID" />

        <Select
          placeholder="Please select a treasury proposal"
          value={selectedID}
          options={proposalIDs?.map((id) => ({
            label: id?.toString(),
            value: id,
          }))}
          onChange={(item) => {
            setSelectedID(item.value);
          }}
        />

        {proposalIDs && <ProposalInfo id={selectedID} />}
      </div>

      <div className="flex justify-end">
        <Tooltip
          content={
            !isMember ? "Only council members can create proposal" : null
          }
          className="inline"
        >
          <TxSubmissionButton
            disabled={disabled}
            loading={loadingProposalIDs}
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
        </Tooltip>
      </div>
    </Popup>
  );
}

function ProposalInfo({ id }) {
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);

  const { value: title } = useTreasuryProposalTitle(id);

  if (isNil(id) || !title) {
    return null;
  }

  return (
    <StatusWrapper className="mt-2">
      <ExternalLink
        className="hover:!underline text-textPrimary"
        externalIcon={false}
        href={`${proposalListUrl}/${id}`}
      >
        {title}
      </ExternalLink>
    </StatusWrapper>
  );
}

function useTreasuryProposalIDs() {
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();

  return useAsync(async () => {
    if (!api) {
      return null;
    }

    const entries = await api.query[treasuryPallet].proposals.entries();
    return orderBy(
      entries.map(([storageKey]) => {
        return storageKey.args[0].toJSON();
      }),
      Number,
      "desc",
    );
  }, [api, treasuryPallet]);
}

function useTreasuryProposalTitle(id) {
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);

  return useAsync(async () => {
    if (isNil(id)) {
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
