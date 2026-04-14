import { useMemo } from "react";
import { isNil } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import { useRankFilterInDropdown } from "next-common/hooks/fellowship/useRankFilter";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { useSortedFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { useFellowshipSalaryClaimants } from "next-common/hooks/fellowship/salary/useFellowshipSalaryClaimants";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import FellowshipRank from "next-common/components/fellowship/rank";

const columns = [
  {
    name: "Rank",
    width: 80,
  },
  {
    name: "Member",
    className: "min-w-[140px]",
  },
  {
    name: "Salary",
    className: "text-right",
    width: 140,
  },
];

function SalaryCell({ member, claimantsMap, cycleIndex }) {
  const claimant = claimantsMap.get(member.address);
  const claimantStatus = claimant?.status;

  if (!claimantStatus) {
    return <span className="text-textTertiary">-</span>;
  }

  const isCurrentCycle =
    isNil(cycleIndex) || claimantStatus?.lastActive === cycleIndex;
  if (!isCurrentCycle) {
    return <span className="text-textTertiary">-</span>;
  }

  const amount =
    claimantStatus?.status?.attempted?.amount ??
    claimantStatus?.status?.registered;

  if (isNil(amount)) {
    return <span className="text-textTertiary">-</span>;
  }

  const { symbol, decimals } = getSalaryAsset();
  return <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />;
}

function useSecretaryMembersFilter(members) {
  const ranks = [...new Set((members || []).map((m) => m.rank))];
  const { rank, component: rankFilterComponent } = useRankFilterInDropdown(
    ranks,
    "All rank",
  );

  const filteredMembers = useMemo(() => {
    if (isNil(rank)) {
      return members;
    }

    return (members || []).filter((member) => member.rank === rank);
  }, [members, rank]);

  return {
    filteredMembers,
    component: (
      <DropdownFilter className="w-[320px]">
        {rankFilterComponent}
      </DropdownFilter>
    ),
  };
}

function SecretaryMembersList() {
  const { members = [], loading: isLoadingMembers } =
    useSortedFellowshipCollectiveMembers();
  const { claimants = [], loading: isLoadingClaimants } =
    useFellowshipSalaryClaimants();
  const salaryStats = useFellowshipSalaryStats();

  const cycleIndex = salaryStats?.cycleIndex;
  const { filteredMembers, component: filters } =
    useSecretaryMembersFilter(members);

  const claimantsMap = useMemo(
    () => new Map((claimants || []).map((item) => [item.address, item])),
    [claimants],
  );

  const rows = useMemo(
    () =>
      (filteredMembers || []).map((member, idx) => [
        <FellowshipRank key={`rank-${idx}`} rank={member.rank} />,
        <AddressUser
          key={`address-${idx}`}
          add={member.address}
          className="text14Medium text-textPrimary"
        />,
        <SalaryCell
          key={`salary-${idx}`}
          member={member}
          claimantsMap={claimantsMap}
          cycleIndex={cycleIndex}
        />,
      ]),
    [filteredMembers, claimantsMap, cycleIndex],
  );

  const isLoading = isLoadingMembers || isLoadingClaimants;

  return (
    <>
      <div className="flex justify-end mb-4">{filters}</div>
      <DataList
        bordered
        columns={columns}
        noDataText="No Members"
        rows={rows}
        loading={isLoading}
      />
    </>
  );
}

function SecretaryMembersContent() {
  return (
    <DropdownUrlFilterProvider
      defaultFilterValues={{
        rank: null,
      }}
      emptyFilterValues={{
        rank: null,
      }}
    >
      <ListLayout
        seoInfo={{
          title: "Secretary Members",
          desc: "Secretary collective members and salary by rank.",
        }}
        title="Secretary Members"
        description="Secretary collective members and salary by rank."
        tabs={[
          {
            value: "members",
            label: "Members",
            url: "/secretary/members",
            exactMatch: true,
          },
        ]}
      >
        <SecretaryMembersList />
      </ListLayout>
    </DropdownUrlFilterProvider>
  );
}

export default function SecretaryMembersPage() {
  return (
    <CollectivesProvider section="secretary">
      <SecretaryMembersContent />
    </CollectivesProvider>
  );
}
