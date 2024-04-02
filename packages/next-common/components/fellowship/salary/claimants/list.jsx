import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipRank from "../../rank";
import { usePageProps } from "next-common/context/page";
import { find, has, isNil } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipSalaryMemberIsRegistered from "./isRegistered";
import Link from "next/link";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import FellowshipSalaryMemberStatus from "./status";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useFellowshipSalaryMemberStatusFilter } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStatusFilter";
import { claimStatsValues, claimantListColumns } from "./consts";

export default function FellowshipSalaryClaimants() {
  const { fellowshipParams, fellowshipMembers, fellowshipSalaryClaimants } =
    usePageProps();
  const { symbol, decimals } = useSalaryAsset();

  const resolvedClaimants = fellowshipSalaryClaimants.map((claimant) => {
    const address = claimant?.address;
    const member = find(fellowshipMembers, { address });
    const rank = member?.rank;

    return {
      rank,
      ...claimant,
    };
  });

  const ranks = [...new Set(fellowshipMembers.map((m) => m.rank))];
  const { rank, component: rankFilterComponent } = useRankFilter(ranks);

  const { status, component: statusFilterComponent } =
    useFellowshipSalaryMemberStatusFilter(claimStatsValues);

  const filteredClaimants =
    isNil(rank) && isNil(status)
      ? resolvedClaimants
      : resolvedClaimants.filter((claimant) => {
          return (
            (isNil(rank) || claimant.rank === rank) &&
            (isNil(status) || has(claimant?.status?.status, status))
          );
        });

  const { activeSalary = [], passiveSalary = [] } = fellowshipParams ?? {};

  const rows = filteredClaimants?.map((claimant) => {
    const address = claimant?.address;
    const status = claimant?.status;
    const cycleIndex = status.lastActive;

    return [
      <FellowshipRank key={`rank-${address}`} rank={claimant.rank} />,
      <AddressUser key={`address-${address}`} add={address} />,
      <FellowshipSalaryMemberIsRegistered
        key={`isRegistered-${address}`}
        status={status?.status}
      />,
      <Link
        key={`lastActive-${address}`}
        href={`/fellowship/salary/cycles/${cycleIndex}`}
        className="text14Medium text-theme500"
      >
        #{cycleIndex}
      </Link>,
      <ValueDisplay
        key={`active-salary-${address}`}
        value={toPrecision(activeSalary[rank - 1] || 0, decimals)}
        symbol={symbol}
      />,
      <ValueDisplay
        key={`passive-salary-${address}`}
        value={toPrecision(passiveSalary[rank - 1] || 0, decimals)}
        symbol={symbol}
      />,
      <FellowshipSalaryMemberStatus
        key={`status-${address}`}
        status={status?.status}
      />,
    ];
  });

  return (
    <div>
      <TitleContainer>
        <span>
          List
          <span className="text-textTertiary text14Medium ml-1">
            {filteredClaimants.length}
          </span>
        </span>
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
