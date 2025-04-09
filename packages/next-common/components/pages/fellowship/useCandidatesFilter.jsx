import { useMemo } from "react";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import {
  OffboardClosing,
  OffboardExpired,
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
} from "next-common/components/pages/fellowship/periodFilters";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useFellowshipCoreOnlySwitchInDropdown } from "next-common/components/fellowship/collective/hook/useFellowshipCoreOnlySwitch";
import { useWishTypeSelectInDropdown } from "./useWishTypeSelect";
import { useStagedFilterState } from "next-common/components/dropdownFilter/context";

export default function useCandidatesFilter(members) {
  const [stagedFilter] = useStagedFilterState();

  const { isOn: isCoreOnly, component: coreOnlySwitch } =
    useFellowshipCoreOnlySwitchInDropdown();
  const { periodFilter, component: periodFilterComponent } =
    usePeriodSelectInDropdown({ isCandidate: true });
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

    if (periodFilter === OffboardClosing) {
      filteredMembers = filterDemotionAboutToExpireFn(
        filteredMembers,
        params,
        blockTime,
        latestHeight,
      );
    } else if (periodFilter === OffboardExpired) {
      filteredMembers = filterDemotionExpiredFn(
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

    return filteredMembers;
  }, [
    members,
    periodFilter,
    isCoreOnly,
    isEvidenceOnly,
    evidenceOnlyFilterFn,
    wishTypeFilter,
    wishTypeFilterFn,
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
    </DropdownFilter>
  );

  return {
    filteredMembers,
    component,
  };
}
