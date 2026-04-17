import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipRank from "next-common/components/fellowship/rank";
import { has, isNil } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipSalaryMemberIsRegistered from "next-common/components/fellowship/salary/claimants/isRegistered";
import Link from "next-common/components/link";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import FellowshipSalaryMemberStatus from "next-common/components/fellowship/salary/claimants/status";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useFellowshipSalaryMemberStatusFilter } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStatusFilter";
import {
  claimStatsValues,
  claimantListColumns,
} from "next-common/components/fellowship/salary/claimants/utils";
import { SystemVoteAbstain } from "@osn/icons/subsquare";
import { getSecretaryMemberSalary } from "next-common/utils/secretary/salary";

function getClaimantAmount(claimant) {
  const status = claimant?.status?.status || {};
  const registered = has(status, "registered")
    ? status?.registered
    : status?.attempted?.registered;
  return status?.attempted?.amount || registered;
}

function ClaimantAmountCell({ claimant }) {
  const { symbol, decimals } = getSalaryAsset();
  const amount = getClaimantAmount(claimant);

  if (isNil(amount)) {
    return <SystemVoteAbstain className="inline-block w-4 h-4" />;
  }

  return <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />;
}

function ClaimantSalaryCell({ rank }) {
  const { symbol, decimals } = getSalaryAsset();
  const salary = getSecretaryMemberSalary(rank);
  if (!salary) {
    return <span className="text-textTertiary">-</span>;
  }
  return <ValueDisplay value={toPrecision(salary, decimals)} symbol={symbol} />;
}

export default function SecretarySalaryClaimantsList({
  claimants = [],
  members = [],
}) {
  const ranks = [...new Set(members.map((m) => m.rank))];
  const { rank, component: rankFilterComponent } = useRankFilter(ranks);

  const { status, component: statusFilterComponent } =
    useFellowshipSalaryMemberStatusFilter(claimStatsValues);

  const filteredClaimants =
    isNil(rank) && isNil(status)
      ? claimants.filter(
          (claimant) => !isNil(claimant.rank) && claimant.rank !== 0,
        )
      : claimants.filter((claimant) => {
          return (
            (isNil(rank) || claimant.rank === rank) &&
            (isNil(status) || has(claimant?.status?.status, status))
          );
        });

  const rows = filteredClaimants?.map((claimant) => {
    const address = claimant?.address;

    return [
      <FellowshipRank key={`rank-${address}`} rank={claimant.rank} />,
      <AddressUser key={`address-${address}`} add={address} />,
      <ClaimantSalaryCell key={`salary-${address}`} rank={claimant.rank} />,
      <ClaimantAmountCell key={`amount-${address}`} claimant={claimant} />,
      <FellowshipSalaryMemberIsRegistered
        key={`isRegistered-${address}`}
        status={claimant?.status?.status}
      />,
      <Link
        key={`lastActive-${address}`}
        href={`/secretary/salary/cycles/${claimant?.status?.lastActive}`}
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
