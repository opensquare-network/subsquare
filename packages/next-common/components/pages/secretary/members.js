import { useMemo } from "react";
import { isNil } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import { useRankFilterInDropdown } from "next-common/hooks/fellowship/useRankFilter";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import ValueDisplay from "next-common/components/valueDisplay";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { useSortedFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import FellowshipRank from "next-common/components/fellowship/rank";
import ListTitleBar from "next-common/components/listTitleBar";
import { getSecretaryMemberSalary } from "next-common/utils/secretary/salary";

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

function SalaryCell({ member }) {
  const salary = getSecretaryMemberSalary(member.rank);
  return <ValueDisplay value={salary} symbol="USDT" />;
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

  const { filteredMembers, component: filters } =
    useSecretaryMembersFilter(members);

  const rows = useMemo(
    () =>
      (filteredMembers || []).map((member, idx) => [
        <FellowshipRank key={`rank-${idx}`} rank={member.rank} />,
        <AddressUser
          key={`address-${idx}`}
          add={member.address}
          className="text14Medium text-textPrimary"
        />,
        <SalaryCell key={`salary-${idx}`} member={member} />,
      ]),
    [filteredMembers],
  );

  return (
    <>
      <div className="mb-4">
        <ListTitleBar
          title="List"
          titleCount={(filteredMembers || []).length}
          titleExtra={filters}
        />
      </div>
      <DataList
        bordered
        columns={columns}
        noDataText="No Members"
        rows={rows}
        loading={isLoadingMembers}
      />
    </>
  );
}

function SecretaryMembersContent() {
  const title = "Secretary Members";
  const description =
    "The Secretary Members are an operational body responsible for executing governance decisions and coordinating administrative workflows for the Polkadot ecosystem. It operates on-chain through the Polkadot Collectives system chain and supports governance execution through defined operational processes.";

  return (
    <ListLayout
      seoInfo={{
        title: title,
        desc: description,
      }}
      title={title}
      description={description}
      tabs={[
        {
          value: "members",
          label: "Members",
          url: "/secretary/members",
          exactMatch: true,
        },
      ]}
    >
      <DropdownUrlFilterProvider
        defaultFilterValues={{
          rank: null,
        }}
        emptyFilterValues={{
          rank: null,
        }}
      >
        <SecretaryMembersList />
      </DropdownUrlFilterProvider>
    </ListLayout>
  );
}

export default function SecretaryMembersPage() {
  return (
    <CollectivesProvider section="secretary">
      <SecretaryMembersContent />
    </CollectivesProvider>
  );
}
