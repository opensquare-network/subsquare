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
import useEvidenceOnlyFilterFn, {
  useWishTypeFilterFn,
} from "./useEvidenceOnlyFilterFn";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "next-common/components/fellowship/collective/hook/useLatestHeightSnapshot";
import {
  filterDemotionAboutToExpireFn,
  filterDemotionExpiredFn,
  filterPromotableFn,
} from "next-common/components/pages/fellowship/periodFilters";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useFellowshipCoreOnlySwitchInDropdown } from "next-common/components/fellowship/collective/hook/useFellowshipCoreOnlySwitch";
import { useWishTypeSelectInDropdown } from "./useWishTypeSelect";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";

export default function useMembersFilter(members) {
  const [stagedFilter] = useStagedFilterState();

  const ranks = [...new Set(members.map((m) => m.rank))];

  const { isOn: isCoreOnly, component: coreOnlySwitch } =
    useFellowshipCoreOnlySwitchInDropdown();
  const { rank, component: rankFilterComponent } =
    useRankFilterInDropdown(ranks);
  const { periodFilter, component: periodFilterComponent } =
    usePeriodSelectInDropdown();
  const { isOn: isEvidenceOnly, component: evidenceOnlySwitch } =
    useEvidenceOnlySwitchInDropdown();
  const { wishTypeFilter, component: wishTypeFilterComponent } =
    useWishTypeSelectInDropdown();

  const evidenceOnlyFilterFn = useEvidenceOnlyFilterFn();
  const wishTypeFilterFn = useWishTypeFilterFn();
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

    if (wishTypeFilter) {
      filteredMembers = wishTypeFilterFn(filteredMembers, wishTypeFilter);
    }

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
  }, [
    members,
    periodFilter,
    isCoreOnly,
    isEvidenceOnly,
    evidenceOnlyFilterFn,
    wishTypeFilter,
    wishTypeFilterFn,
    rank,
    isLoading,
    latestHeight,
    blockTime,
    params,
  ]);

  const component = (
    <DropdownFilter className="w-[320px]">
      {coreOnlySwitch}
      {evidenceOnlySwitch}
      {stagedFilter.evidence_only && wishTypeFilterComponent}
      {periodFilterComponent}
      {rankFilterComponent}
    </DropdownFilter>
  );

  return {
    filteredMembers,
    component,
  };
}
