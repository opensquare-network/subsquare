import { isNil, orderBy } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import ExternalLink from "next-common/components/externalLink";
import PopupLabel from "next-common/components/popup/label";
import { StatusWrapper } from "next-common/components/popup/styled";
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
} from "next-common/context/treasury";
import Tooltip from "next-common/components/tooltip";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { CacheProvider, useCache } from "next-common/context/cache";

export default function TreasuryProposalPopupContent({
  onClose,
  isMember,
  treasuryProposalAction = "approveProposal",
}) {
  const router = useRouter();
  const pallet = useCollectivePallet();
  const treasuryPallet = useTreasuryPallet();
  const api = useContextApi();

  const { members } = useCollectiveMembers();
  const threshold = Math.floor(members?.length / 2) + 1;

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

    const proposal =
      api.tx[treasuryPallet][treasuryProposalAction]?.(selectedID);
    const proposalLength = proposal?.encodedLength || 0;

    const params =
      api.tx[pallet].propose.meta.args.length === 3
        ? [threshold, proposal, proposalLength]
        : [threshold, proposal];

    return api.tx[pallet].propose(...params);
  }, [
    api,
    selectedID,
    pallet,
    threshold,
    treasuryPallet,
    treasuryProposalAction,
  ]);

  const options = proposalIDs?.map((id) => ({
    label: (
      <div className="flex items-center">
        <span>
          {id}
          &nbsp;
          {"·"}
          &nbsp;
        </span>
        <ProposalTitle id={id} />
      </div>
    ),
    value: id,
  }));

  return (
    <>
      <SignerWithBalance />

      <div>
        <PopupLabel text="Proposal ID" />

        <CacheProvider>
          <Select
            placeholder="Please select a treasury proposal"
            value={selectedID}
            options={options}
            onChange={(item) => {
              setSelectedID(item.value);
            }}
          />

          {proposalIDs && <ProposalInfo id={selectedID} />}
        </CacheProvider>
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
    </>
  );
}

function ProposalTitle({ id }) {
  const { value: title, loading } = useTreasuryProposalTitle(id);

  if (loading) {
    return <FieldLoading />;
  }

  if (isNil(id) || !title) {
    return null;
  }

  return <span>{title}</span>;
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

    const proposalEntries = await api.query[treasuryPallet].proposals.entries();
    const approvals = await api.query[treasuryPallet].approvals();
    const proposalIds = proposalEntries.map(([storageKey]) =>
      storageKey.args[0].toNumber(),
    );
    const approvedIds = approvals.toJSON();
    return orderBy(
      proposalIds.filter((id) => !approvedIds.includes(id)),
      Number,
      "desc",
    );
  }, [api, treasuryPallet]);
}

function useTreasuryProposalTitle(id) {
  const treasuryPallet = useTreasuryPallet();
  const proposalListUrl = useTreasuryProposalListUrl(treasuryPallet);
  const { getCacheItem, setCacheItem } = useCache();

  return useAsync(async () => {
    if (isNil(id)) {
      return null;
    }

    const cachedTitle = getCacheItem(id);
    if (cachedTitle) {
      return cachedTitle;
    }

    const resp = await nextApi.fetch(
      `${
        proposalListUrl.startsWith("/")
          ? proposalListUrl.slice(1)
          : proposalListUrl
      }/${id}?simple=true`,
    );

    const title = resp?.result?.title;

    if (title) {
      setCacheItem(id, title);
    }

    return title;
  }, [id, proposalListUrl, getCacheItem, setCacheItem]);
}
