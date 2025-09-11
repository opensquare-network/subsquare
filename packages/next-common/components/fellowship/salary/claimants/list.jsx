import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipRank from "../../rank";
import { has, isNil } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipSalaryMemberIsRegistered from "./isRegistered";
import Link from "next/link";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import FellowshipSalaryMemberStatus from "./status";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useFellowshipSalaryMemberStatusFilter } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStatusFilter";
import { claimStatsValues, claimantListColumns } from "./utils";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";

export default function FellowshipSalaryClaimantsList({
  claimants = [],
  params = {},
  members = [],
}) {
  const { symbol, decimals } = getSalaryAsset();

  const ranks = [...new Set(members.map((m) => m.rank))];
  const { rank, component: rankFilterComponent } = useRankFilter(ranks);

  const { status, component: statusFilterComponent } =
    useFellowshipSalaryMemberStatusFilter(claimStatsValues);

  const filteredClaimants =
    isNil(rank) && isNil(status)
      ? claimants
      : claimants.filter((claimant) => {
          return (
            (isNil(rank) || claimant.rank === rank) &&
            (isNil(status) || has(claimant?.status?.status, status))
          );
        });

  const { activeSalary = [], passiveSalary = [] } = params ?? {};

  const rows = filteredClaimants?.map((claimant) => {
    const address = claimant?.address;

    return [
      <FellowshipRank key={`rank-${address}`} rank={claimant.rank} />,
      <AddressUser key={`address-${address}`} add={address} />,
      <ValueDisplay
        key={`active-salary-${address}`}
        value={toPrecision(
          getRankSalary(activeSalary, claimant.rank),
          decimals,
        )}
        symbol={symbol}
      />,
      <ValueDisplay
        key={`passive-salary-${address}`}
        value={toPrecision(getRankSalary(passiveSalary, rank), decimals)}
        symbol={symbol}
      />,
      <FellowshipSalaryMemberIsRegistered
        key={`isRegistered-${address}`}
        status={claimant?.status?.status}
      />,
      <Link
        key={`lastActive-${address}`}
        href={`/fellowship/salary/cycles/${claimant?.status?.lastActive}`}
        className="text14Medium text-theme500"
      >
        #{claimant?.status?.lastActive}
      </Link>,
      <FellowshipSalaryMemberStatus
        key={`status-${address}`}
        status={claimant?.status?.status}
      />,
    ];
  });

  return (
    <div>
      <TitleContainer className="gap-3">
        <div>
          List
          <span className="text-textTertiary text14Medium ml-1">
            {filteredClaimants.length}
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          {rankFilterComponent}
          {statusFilterComponent}
        </div>
      </TitleContainer>

      <SecondaryCard className="mt-4">
        <DataList
          className="text14Medium"
          columns={claimantListColumns}
          noDataText="No Claimants"
          rows={rows}
        />
      </SecondaryCard>
    </div>
  );
}
