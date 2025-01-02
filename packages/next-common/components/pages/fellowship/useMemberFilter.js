import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useRankFilterInDropdown } from "next-common/hooks/fellowship/useRankFilter";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import {
  DemotionPeriodAboutToExpire,
  DemotionPeriodExpired,
  Promotable,
  usePeriodSelectInDropdown,
} from "./usePeriodSelect";
import { useEvidenceOnlySwitchInDropdown } from "./useEvidenceOnlySwitch";
import useEvidenceOnlyFilterFn from "./useEvidenceOnlyFilterFn";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "next-common/components/fellowship/collective/hook/useLatestHeightSnapshot";
import {
  filterDemotionAboutToExpireFn,
  filterDemotionExpiredFn,
  filterPromotableFn,
} from "next-common/components/pages/fellowship/periodFilters";
import { DropdownFilter } from "next-common/components/dropdownFilter";

export default function useMembersFilter(members) {
  const ranks = [...new Set(members.map((m) => m.rank))];

  const { rank, component: rankFilterComponent } =
    useRankFilterInDropdown(ranks);
  const { periodFilter, component: periodFilterComponent } =
    usePeriodSelectInDropdown();
  const { isOn: isEvidenceOnly, component: evidenceOnlySwitch } =
    useEvidenceOnlySwitchInDropdown();

  const evidenceOnlyFilterFn = useEvidenceOnlyFilterFn();
  const params = useCoreFellowshipParams();
  const blockTime = useSelector(blockTimeSelector);

  const { latestHeight, isLoading } = useLatestHeightSnapshot();

  const filteredMembers = useMemo(() => {
    if (isLoading) {
      return;
    }

    let filteredMembers = members;

    if (periodFilter === DemotionPeriodAboutToExpire) {
      filteredMembers = filterDemotionAboutToExpireFn(
        filteredMembers,
        params,
        blockTime,
        latestHeight,
      );
    } else if (periodFilter === DemotionPeriodExpired) {
      filteredMembers = filterDemotionExpiredFn(
        filteredMembers,
        params,
        latestHeight,
      );
    } else if (periodFilter === Promotable) {
      filteredMembers = filterPromotableFn(
        filteredMembers,
        params,
        latestHeight,
      );
    }

    if (isEvidenceOnly) {
      filteredMembers = evidenceOnlyFilterFn(filteredMembers);
    }

    if (isNil(rank)) {
      return filteredMembers;
    } else {
      return filteredMembers.filter((m) => m.rank === rank);
    }
  }, [
    members,
    periodFilter,
    isEvidenceOnly,
    evidenceOnlyFilterFn,
    rank,
    isLoading,
    latestHeight,
    blockTime,
    params,
  ]);

  const component = (
    <DropdownFilter className="w-[320px]">
      {evidenceOnlySwitch}
      {periodFilterComponent}
      {rankFilterComponent}
    </DropdownFilter>
  );

  return {
    filteredMembers,
    component,
  };
}
