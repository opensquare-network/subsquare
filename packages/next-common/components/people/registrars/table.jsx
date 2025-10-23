import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TableName } from "next-common/components/data/common/tableHeader";
import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings, useChain } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";
import { isNil } from "lodash-es";
import { memo, useMemo } from "react";
import { getRelayChain } from "next-common/utils/chain";

function LastJudgementLink({ indexer, children }) {
  const currentChain = useChain();
  const relayChain = getRelayChain(currentChain);
  const { blockHeight, extrinsicIndex, chain } = indexer;
  const link = useMemo(() => {
    if (isNil(blockHeight) && isNil(extrinsicIndex)) {
      return null;
    }

    let domain = null;
    if (isNil(chain)) {
      domain = `https://${relayChain}.statescan.io/#`;
    } else {
      domain = `https://${chain}-${relayChain}.statescan.io/#`;
    }

    if (isNil(extrinsicIndex)) {
      return `${domain}/blocks/${blockHeight}`;
    }

    return `${domain}/extrinsics/${blockHeight}-${extrinsicIndex}`;
  }, [blockHeight, extrinsicIndex, chain, relayChain]);

  if (isNil(link)) {
    return children;
  }

  return (
    <Link href={link} target="_blank" className="hover:text-theme500">
      {children}
    </Link>
  );
}

const LastJudgementWrapper = memo(LastJudgementLink);

const columns = [
  {
    name: "Registrar",
  },
  {
    name: "Latest Judgement",
    width: 160,
  },
  {
    name: "Received Request",
    width: 160,
    headClassName: "text-right",
  },
  {
    name: "Total Given",
    width: 160,
    headClassName: "text-right",
  },
  {
    name: "Fee",
    width: 160,
    headClassName: "text-right",
  },
];

export default function RegistrarsTable({
  registrars = [],
  isLoading,
  total = 0,
}) {
  const { decimals, symbol } = useChainSettings();

  return (
    <div className="flex flex-col gap-y-4">
      <TableName title="Registrars" total={total} loading={isLoading} />
      <SecondaryCard className="space-y-2">
        <DataList
          columns={columns}
          rows={(registrars || []).map((item, index) => {
            const time = item?.statistics?.lastGivenIndexer?.blockTime;
            return [
              <RegistrarUserAddress
                key={`account-${item.account}`}
                item={item}
                index={index}
              />,
              <div
                key={`last-judgement-${item.account}`}
                className="text-textPrimary text14Medium"
              >
                {time ? (
                  <Tooltip content={formatTime(time)}>
                    <LastJudgementWrapper
                      indexer={item.statistics.lastGivenIndexer}
                    >
                      {formatTimeAgo(time)}
                    </LastJudgementWrapper>
                  </Tooltip>
                ) : (
                  "-"
                )}
              </div>,
              <div
                key={`request-${index}`}
                className="text-textPrimary text14Medium text-right"
              >
                {item?.statistics?.request || "-"}
              </div>,
              <div
                key={`given-${index}`}
                className="text-textPrimary text14Medium text-right"
              >
                {item?.statistics?.given || "-"}
              </div>,
              <div
                key={`fee-${index}`}
                className="text-textPrimary text14Medium text-right"
              >
                {toPrecision(item.fee, decimals)} {symbol}
              </div>,
            ];
          })}
          loading={isLoading}
          noDataText="No registrars"
        />
      </SecondaryCard>
    </div>
  );
}

function RegistrarUserAddress({ item, index }) {
  return (
    <div className="flex items-center gap-x-2">
      <span className="text-textPrimary text14Medium inline-block w-6">
        #{index + 1}
      </span>
      <AddressUser key={`account-${item.account}`} add={item.account} />
    </div>
  );
}
