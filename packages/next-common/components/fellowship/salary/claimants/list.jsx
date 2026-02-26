import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipRank from "../../rank";
import { has, isNil } from "lodash-es";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipSalaryMemberIsRegistered from "./isRegistered";
import Link from "next-common/components/link";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import FellowshipSalaryMemberStatus from "./status";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useFellowshipSalaryMemberStatusFilter } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStatusFilter";
import { claimStatsValues, claimantListColumns } from "./utils";
import Tooltip from "next-common/components/tooltip";
import { isSameAddress } from "next-common/utils";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { SystemVoteAbstain } from "@osn/icons/subsquare";

function SalaryCellTooltip({ isActive, rank, params, children }) {
  const { symbol, decimals } = getSalaryAsset();
  const { activeSalary = [], passiveSalary = [] } = params ?? {};

  const activeRankSalary = getRankSalary(activeSalary, rank);
  const passiveRankSalary = getRankSalary(passiveSalary, rank);

  return (
    <Tooltip
      content={
        <div>
          {!isNil(isActive) && (
            <div>This member is {isActive ? "active" : "passive"}</div>
          )}
          <div className="flex gap-1">
            <span>Active Salary:</span>
            <span>
              {toPrecision(activeRankSalary, decimals)}&nbsp;{symbol}
            </span>
          </div>
          <div className="flex gap-1">
            <span>Passive Salary:</span>
            <span>
              {toPrecision(passiveRankSalary, decimals)}&nbsp;{symbol}
            </span>
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
}

function ClaimantAmountCell({ claimant }) {
  const { symbol, decimals } = getSalaryAsset();
  const status = claimant?.status?.status || {};
  const registered = has(status, "registered")
    ? status?.registered
    : status?.attempted?.registered;
  const amount = status?.attempted?.amount || registered;

  if (isNil(amount)) {
    return <SystemVoteAbstain className="inline-block w-4 h-4" />;
  }

  return <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />;
}

function ClaimantSalaryCell({ claimant, member, params }) {
  const isActive = member?.status?.isActive;
  const rank = claimant?.rank;

  const { symbol, decimals } = getSalaryAsset();
  const { activeSalary = [], passiveSalary = [] } = params ?? {};

  const activeRankSalary = getRankSalary(activeSalary, rank);
  const passiveRankSalary = getRankSalary(passiveSalary, rank);
  const salary = isActive ? activeRankSalary : passiveRankSalary;

  return isNil(isActive) || isNil(salary) ? (
    <FieldLoading size={16} />
  ) : (
    <ValueDisplay value={toPrecision(salary, decimals)} symbol={symbol} />
  );
}

export default function FellowshipSalaryClaimantsList({
  claimants = [],
  params = {},
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
    const member = members.find((item) =>
      isSameAddress(item?.address, address),
    );

    return [
      <FellowshipRank key={`rank-${address}`} rank={claimant.rank} />,
      <AddressUser key={`address-${address}`} add={address} />,
      <SalaryCellTooltip
        key={`salary-${address}`}
        isActive={member?.status?.isActive}
        rank={claimant.rank}
        params={params}
      >
        <ClaimantSalaryCell
          claimant={claimant}
          member={member}
          params={params}
        />
      </SalaryCellTooltip>,
      <ClaimantAmountCell key={`amount-${address}`} claimant={claimant} />,
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
