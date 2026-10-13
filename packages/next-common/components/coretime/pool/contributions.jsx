import { useMemo } from "react";
import { isNil } from "lodash-es";
import { MapDataList } from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import NumberWithComma from "next-common/components/numberWithComma";
import Tooltip from "next-common/components/tooltip";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { formatRegionShare } from "next-common/components/coretime/regions/utils";
import RegionStatusTag from "next-common/components/coretime/regions/statusTag";
import RegionTimeColumn, {
  RegionTimeHeaderButton,
} from "next-common/components/coretime/regions/timeColumn";
import ContributionActionColumn from "./contributionActionColumn";
import { timeslicesPerDay } from "./utils";

function LengthColumn({ length, perDay }) {
  if (isNil(length)) {
    return <span className="text-textTertiary">-</span>;
  }

  const days = perDay ? Number((length / perDay).toFixed(1)) : null;

  return (
    <Tooltip
      content={`${length.toLocaleString()} timeslices${
        days ? ` ≈ ${days} days` : ""
      }`}
    >
      <span>
        <NumberWithComma value={length} />
        {days ? <span className="text-textTertiary"> ≈ {days}d</span> : null}
      </span>
    </Tooltip>
  );
}

export default function PoolContributions({ contributions = [], loading }) {
  const api = useContextApi();
  const { blockTime } = useChainSettings();
  const timeslicePeriod = api?.consts.broker?.timeslicePeriod?.toNumber();

  const perDay = useMemo(
    () => timeslicesPerDay(timeslicePeriod, blockTime),
    [timeslicePeriod, blockTime],
  );

  const columnsDef = useMemo(
    () => [
      {
        name: "Core",
        key: "core",
        className: "w-[90px] text-left",
        render: (contribution) => <span>#{contribution.core}</span>,
      },
      {
        name: <RegionTimeHeaderButton name="Start time" ageName="Start age" />,
        key: "start",
        className: "w-[140px]",
        render: (contribution) => (
          <RegionTimeColumn
            height={
              timeslicePeriod ? contribution.begin * timeslicePeriod : null
            }
          />
        ),
      },
      {
        name: <RegionTimeHeaderButton name="End time" ageName="End age" />,
        key: "end",
        className: "w-[140px]",
        render: (contribution) => (
          <RegionTimeColumn
            height={
              timeslicePeriod
                ? (contribution.begin + contribution.length) * timeslicePeriod
                : null
            }
          />
        ),
      },
      {
        name: "Length",
        key: "length",
        className: "w-[150px]",
        render: (contribution) => (
          <LengthColumn length={contribution.length} perDay={perDay} />
        ),
      },
      {
        name: "Share",
        key: "share",
        className: "w-[110px]",
        render: (contribution) => {
          const { parts, totalParts } = formatRegionShare(contribution.mask);
          return (
            <Tooltip content={`Contributed: ${parts} / Total: ${totalParts}`}>
              <span>
                {parts}/{totalParts}
              </span>
            </Tooltip>
          );
        },
      },
      {
        name: "Payee",
        key: "payee",
        className: "min-w-[200px]",
        render: (contribution) => (
          <AddressUser add={contribution.payee} maxWidth={160} />
        ),
      },
      {
        name: "Status",
        key: "status",
        className: "w-[110px] flex justify-end text-right",
        render: (contribution) => (
          <RegionStatusTag status={contribution.status} />
        ),
      },
      {
        name: "",
        key: "action",
        className: "w-[80px] flex justify-end text-right",
        render: (contribution) => (
          <ContributionActionColumn contribution={contribution} />
        ),
      },
    ],
    [timeslicePeriod, perDay],
  );

  return (
    <MapDataList
      columnsDef={columnsDef}
      data={contributions}
      getRowKey={(contribution) =>
        `${contribution.begin}-${contribution.core}-${contribution.mask}`
      }
      loading={loading}
      noDataText="No pool contributions"
    />
  );
}
