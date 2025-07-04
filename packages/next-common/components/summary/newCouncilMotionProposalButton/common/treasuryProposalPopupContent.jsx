import { isNil, orderBy } from "lodash-es";
import ExternalLink from "next-common/components/externalLink";
import PopupLabel from "next-common/components/popup/label";
import { StatusWrapper } from "next-common/components/popup/styled";
import Select from "next-common/components/select";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { backendApi } from "next-common/services/nextApi";
import { useCallback, useState } from "react";
import { useAsync } from "react-use";
import {
  useTreasuryPallet,
  useTreasuryProposalListUrl,
} from "next-common/context/treasury";
import Tooltip from "next-common/components/tooltip";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { CacheProvider, useCache } from "next-common/context/cache";
import CouncilProposeButton from "./councilProposeButton";

export default function TreasuryProposalPopupContent({
  isMember,
  treasuryProposalAction = "approveProposal",
}) {
  const treasuryPallet = useTreasuryPallet();
  const api = useContextApi();

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

    return api.tx[treasuryPallet][treasuryProposalAction]?.(selectedID);
  }, [api, selectedID, treasuryPallet, treasuryProposalAction]);

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
          <CouncilProposeButton
            disabled={disabled}
            loading={loadingProposalIDs}
            getTxFunc={getTxFunc}
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

    const resp = await backendApi.fetch(
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
