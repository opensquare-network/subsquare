import { useMemo } from "react";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { OffboardClosing, usePeriodSelectInDropdown } from "./usePeriodSelect";
import { useEvidenceOnlySwitchInDropdown } from "./useEvidenceOnlySwitch";
import useEvidenceOnlyFilterFn from "./useEvidenceOnlyFilterFn";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import useLatestHeightSnapshot from "next-common/components/fellowship/collective/hook/useLatestHeightSnapshot";
import { filterDemotionAboutToExpireFn } from "next-common/components/pages/fellowship/periodFilters";
import { DropdownFilter } from "next-common/components/dropdownFilter";
import { useFellowshipCoreOnlySwitchInDropdown } from "next-common/components/fellowship/collective/hook/useFellowshipCoreOnlySwitch";

export default function useCandidatesFilter(members) {
  const { isOn: isCoreOnly, component: coreOnlySwitch } =
    useFellowshipCoreOnlySwitchInDropdown();
  const { periodFilter, component: periodFilterComponent } =
    usePeriodSelectInDropdown({ isCandidate: true });
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

    if (periodFilter === OffboardClosing) {
      filteredMembers = filterDemotionAboutToExpireFn(
        filteredMembers,
        params,
        blockTime,
        latestHeight,
      );
    }

    if (isEvidenceOnly) {
      filteredMembers = evidenceOnlyFilterFn(filteredMembers);
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
    isLoading,
    latestHeight,
    blockTime,
    params,
  ]);

  const component = (
    <DropdownFilter className="w-[320px]">
      {coreOnlySwitch}
      {evidenceOnlySwitch}
      {periodFilterComponent}
    </DropdownFilter>
  );

  return {
    filteredMembers,
    component,
  };
}
