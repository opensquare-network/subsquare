import { SystemVoteAye } from "@osn/icons/subsquare";
import { useEffect, useMemo, useState } from "react";

import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import ListTitleBar from "next-common/components/listTitleBar";
import Tooltip from "next-common/components/tooltip";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { AddressUser } from "next-common/components/user";

import usePendingJudgementRequests from "next-common/components/people/hooks/usePendingJudgementRequests";
import { PeopleSocialType } from "next-common/components/people/judgement/consts";

const PAGE_SIZE = 20;

function getSocialInfoKey(type) {
  return type === PeopleSocialType.element ? "matrix" : type;
}

function getConfiguredSocialAccounts(info = {}) {
  const allTypes = Object.values(PeopleSocialType);
  return allTypes
    .map((type) => {
      const infoKey = getSocialInfoKey(type);
      const value = info?.[infoKey];
      if (!value) {
        return null;
      }
      return { type, value };
    })
    .filter(Boolean);
}

function getSocialCounts(info = {}, verification = {}) {
  const configured = getConfiguredSocialAccounts(info);
  const total = configured.length;
  const verified = configured.filter(
    ({ type }) => verification?.[type] === true,
  ).length;
  return { verified, total };
}

function renderVerificationStatus(verificationValue) {
  if (verificationValue !== true) {
    return null;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <SystemVoteAye className="inline w-4 h-4" />
    </span>
  );
}

function SocialAccountsTooltipContent({ judgementRequest }) {
  const info = judgementRequest?.info || {};
  const verification = judgementRequest?.verification || {};
  const configured = getConfiguredSocialAccounts(info);

  if (!configured.length) {
    return <div className="text12Normal">No social accounts set</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {configured.map(({ type, value }) => (
        <div key={type} className="flex items-center gap-2">
          <span className="capitalize text-textPrimaryContrast/80 min-w-[70px]">
            {type}
          </span>
          <span className="break-all">{value}</span>
          <span className="ml-2 text-textPrimaryContrast/80">
            {renderVerificationStatus(verification?.[type])}
          </span>
        </div>
      ))}
    </div>
  );
}

function SocialAccounts({ judgementRequest }) {
  const { verified, total } = getSocialCounts(
    judgementRequest?.info,
    judgementRequest?.verification,
  );

  return (
    <Tooltip
      content={
        <SocialAccountsTooltipContent judgementRequest={judgementRequest} />
      }
    >
      <span className="inline-flex items-center gap-2">
        <span className="text-textPrimary">{verified}</span>
        <span className="text-textTertiary">/</span>
        <span className="text-textTertiary">{total}</span>
      </span>
    </Tooltip>
  );
}

function AllVerified({ judgementRequest }) {
  const { verified, total } = getSocialCounts(
    judgementRequest?.info,
    judgementRequest?.verification,
  );

  const allVerified = total > 0 && verified === total;
  return allVerified ? (
    <SystemVoteAye className="inline w-5 h-5" />
  ) : (
    <span className="text-textTertiary">-</span>
  );
}

export default function JudgementRequestsList() {
  const [total, setTotal] = useState(0);
  const { page, component: pagination } = usePaginationComponent(
    total,
    PAGE_SIZE,
    {
      buttonMode: true,
    },
  );

  const { value: pageData, loading } = usePendingJudgementRequests(
    page,
    PAGE_SIZE,
  );

  useEffect(() => {
    setTotal(pageData?.total || 0);
  }, [pageData?.total]);

  const items = pageData?.items || [];

  const columnsDef = useMemo(
    () => [
      {
        name: "Applicant",
        style: { textAlign: "left", minWidth: "240px" },
        render: (judgementRequest) => (
          <AddressUser add={judgementRequest?.who} />
        ),
      },
      {
        name: "Social Accounts",
        style: { textAlign: "left", width: "220px", minWidth: "220px" },
        render: (judgementRequest) => (
          <SocialAccounts judgementRequest={judgementRequest} />
        ),
      },
      {
        name: "All Verified",
        style: { textAlign: "left", width: "120px", minWidth: "120px" },
        render: (judgementRequest) => (
          <AllVerified judgementRequest={judgementRequest} />
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center mr-6 max-md:px-[24px]">
        <ListTitleBar title="List" titleCount={total} />
      </div>

      <SecondaryCard>
        <ScrollerX>
          <MapDataList
            columnsDef={columnsDef}
            data={items}
            loading={loading}
            noDataText="No pending judgement requests"
            getRowKey={(item) =>
              `${item?.who || ""}-${item?.indexer?.blockHeight || ""}`
            }
          />
        </ScrollerX>
        {pagination}
      </SecondaryCard>
    </div>
  );
}
