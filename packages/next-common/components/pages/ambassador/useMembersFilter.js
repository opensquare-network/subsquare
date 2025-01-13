import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useRankFilterInDropdown } from "next-common/hooks/fellowship/useRankFilter";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useFellowshipCoreOnlySwitchInDropdown } from "next-common/components/fellowship/collective/hook/useFellowshipCoreOnlySwitch";

export default function useMembersFilter(members) {
  const ranks = [...new Set(members.map((m) => m.rank))];

  const { isOn: isCoreOnly, component: coreOnlySwitch } =
    useFellowshipCoreOnlySwitchInDropdown();
  const { rank, component: rankFilterComponent } =
    useRankFilterInDropdown(ranks);

  const filteredMembers = useMemo(() => {
    let filteredMembers = members;

    if (isCoreOnly) {
      filteredMembers = filteredMembers.filter(
        (member) => member.isFellowshipCoreMember,
      );
    }

    if (isNil(rank)) {
      return filteredMembers;
    } else {
      return filteredMembers.filter((m) => m.rank === rank);
    }
  }, [members, isCoreOnly, rank]);

  const component = (
    <DropdownFilter className="w-[320px]">
      {coreOnlySwitch}
      {rankFilterComponent}
    </DropdownFilter>
  );

  return {
    filteredMembers,
    component,
  };
}
