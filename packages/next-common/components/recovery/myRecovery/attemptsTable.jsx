"use client";

import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import { useRelayChainApi } from "next-common/context/relayChain";
import { useChainSettings } from "next-common/context/chain";
import { estimateBlocksTime } from "next-common/utils";
import useCall from "next-common/utils/hooks/useCall";
import { isNil } from "lodash-es";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import SlashAttemptDialog from "./slashAttemptDialog";

function BlockNumberWithTooltip({ height }) {
  const api = useRelayChainApi();
  const { blockTime } = useChainSettings();
  const { value: currentNumber } = useCall(api?.query?.system?.number, []);
  const currentHeight = currentNumber?.toNumber();

  if (isNil(height) || isNil(currentHeight)) {
    return (
      <span className="text14Medium text-textPrimary">
        #{height?.toLocaleString() || 0}
      </span>
    );
  }

  const diff = Math.max(0, currentHeight - height);
  const estimatedTime = diff > 0 ? estimateBlocksTime(diff, blockTime) : null;

  return (
    <Tooltip content={estimatedTime ? `${estimatedTime} ago` : ""}>
      <span className="text14Medium text-textPrimary">
        #{height?.toLocaleString() || 0}
      </span>
    </Tooltip>
  );
}

const desktopColumns = [
  {
    name: "Group Index",
    className: "w-[120px] text-left",
    render: (item) => (
      <Tooltip
        content={
          item.fgGroup && (
            <AddressesTooltip
              addresses={item.fgGroup?.friends || []}
              addressMaxWidth={160}
            />
          )
        }
      >
        <span className="text14Medium text-textPrimary">
          #{item.friendGroupIndex}
        </span>
      </Tooltip>
    ),
  },
  {
    name: "Initiator",
    className: "min-w-[200px] text-left",
    render: (item) => (
      <AddressUser key="initiator" add={item.initiator} maxWidth={200} />
    ),
  },
  {
    name: "Init Block",
    className: "w-[180px] text-left",
    render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
  },
  {
    name: "Last Approval Block",
    className: "w-[200px] text-left",
    render: (item) => (
      <BlockNumberWithTooltip height={item.lastApprovalBlock} />
    ),
  },
  {
    name: "Threshold / Approvals",
    className: "w-[160px] text-left",
    render: (item) => (
      <Tooltip
        content={
          item.approvedAddresses?.length > 0 && (
            <AddressesTooltip
              addresses={item.approvedAddresses}
              addressMaxWidth={160}
            />
          )
        }
      >
        <span className="text14Medium text-textPrimary">
          {item.fgGroup && (
            <span className="text-textTertiary">
              {item.fgGroup?.friendsNeeded || 0} /{" "}
            </span>
          )}
          {item.approvalsCount}
        </span>
      </Tooltip>
    ),
  },
  {
    name: "Action",
    className: "w-[100px] text-right",
    render: (item) => <SlashButton friendGroupIndex={item.friendGroupIndex} />,
  },
];

const mobileColumns = [
  {
    name: "Group Index",
    className: "text-right",
    render: (item) => (
      <Tooltip
        content={
          item.fgGroup && (
            <AddressesTooltip
              addresses={item.fgGroup?.friends || []}
              addressMaxWidth={160}
            />
          )
        }
      >
        <span className="text14Medium text-textPrimary cursor-pointer">
          #{item.friendGroupIndex}
        </span>
      </Tooltip>
    ),
  },
  {
    name: "Initiator",
    className: "text-left",
    render: (item) => <AddressUser add={item.initiator} maxWidth={120} />,
  },
  {
    name: "Init Block",
    className: "text-right",
    render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
  },
  {
    name: "Last Approval Block",
    className: "text-right",
    render: (item) => (
      <BlockNumberWithTooltip height={item.lastApprovalBlock} />
    ),
  },
  {
    name: "Threshold / Approvals",
    className: "text-right",
    render: (item) => (
      <Tooltip
        content={
          item.approvedAddresses?.length > 0 && (
            <AddressesTooltip
              addresses={item.approvedAddresses}
              addressMaxWidth={160}
            />
          )
        }
      >
        <span className="text14Medium text-textPrimary">
          {item.fgGroup && (
            <span className="text-textTertiary">
              {item.fgGroup?.friendsNeeded || 0} /{" "}
            </span>
          )}
          {item.approvalsCount}
        </span>
      </Tooltip>
    ),
  },
  {
    name: "Action",
    className: "text-left",
    render: (item) => <SlashButton friendGroupIndex={item.friendGroupIndex} />,
  },
];

function SlashButton({ friendGroupIndex }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {showDialog && (
        <SlashAttemptDialog
          onClose={() => setShowDialog(false)}
          friendGroupIndex={friendGroupIndex}
        />
      )}
      <button
        type="button"
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        Slash
      </button>
    </>
  );
}

function enhanceAttemptWithFriendGroup(attempt, friendGroups = []) {
  const fgList = friendGroups?.find((fg) => fg.account === attempt.lostAccount);
  const fgGroup = fgList?.friendGroups?.[attempt.friendGroupIndex];
  return { ...attempt, fgGroup };
}

export default function MyRecoveryAttemptsTable({
  data,
  loading: isLoading,
  friendGroups,
}) {
  const [navCollapsed] = useNavCollapsed();
  const [dataList, setDataList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const total = data?.length || 0;

  useEffect(() => {
    setLoading(true);
  }, [page]);

  useEffect(() => {
    if (isLoading || isNil(data)) {
      return;
    }

    const enhanced = (data || []).map((attempt) =>
      enhanceAttemptWithFriendGroup(attempt, friendGroups),
    );

    setTotalCount(total);
    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(enhanced?.slice(startIndex, endIndex));
    setLoading(false);
  }, [data, isLoading, page, total, friendGroups]);

  return (
    <SecondaryCard className="space-y-2">
      <ScrollerX>
        <MapDataList
          className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
          columnsDef={desktopColumns}
          data={dataList}
          loading={loading}
          noDataText="No data"
        />

        <MapDataList
          className={cn(
            "hidden",
            navCollapsed ? "max-sm:block" : "max-md:block",
          )}
          columnsDef={mobileColumns}
          data={dataList}
          loading={loading}
          noDataText="No data"
        />
      </ScrollerX>
      {total > 0 && pageComponent}
    </SecondaryCard>
  );
}
