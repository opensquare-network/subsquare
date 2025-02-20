import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";
import { useContextCoreMembers } from "../coreMembers";
import { useContextCollectivesMembers } from "../collectivesMember";
import { useContextMySalaryClaimant } from "../mySalaryClaimant";
import { useContextSalaryStats } from "../salaryStats";
import { useContextCoreParams } from "../coreParams";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";

function useMyMemberData(members) {
  const realAddress = useRealAddress();
  return useMemo(
    () => (members || []).find((m) => isSameAddress(m.address, realAddress)),
    [realAddress, members],
  );
}

export function useContextMyCoreMember() {
  const { members } = useContextCoreMembers();
  return useMyMemberData(members);
}

export function useIsCoreMember() {
  const member = useContextMyCoreMember();
  return member && member.rank > 0;
}

export function useIsCoreCandidate() {
  const member = useContextMyCoreMember();
  return member && member.rank === 0;
}

export function useContextMyCollectivesMember() {
  const { members } = useContextCollectivesMembers();
  return useMyMemberData(members);
}

export function useIsCollectivesMember() {
  const member = useContextMyCollectivesMember();
  return !!member;
}

export function useIsImported() {
  const { claimant } = useContextMySalaryClaimant();
  return !!claimant;
}

export function useIsSalaryRegistered() {
  const salaryStats = useContextSalaryStats();
  const { claimant } = useContextMySalaryClaimant();
  if (!salaryStats || !claimant) {
    return false;
  }
  return claimant.lastActive >= salaryStats.cycleIndex;
}

export function useMySalary() {
  const collectivesMember = useContextMyCollectivesMember();
  const coreMember = useContextMyCoreMember();
  const params = useContextCoreParams();

  if (!collectivesMember || !coreMember) {
    return 0;
  }

  const { activeSalary = [], passiveSalary = [] } = params || {};
  const { rank } = collectivesMember || {};
  const { isActive } = coreMember || {};

  const salaryArray = isActive ? activeSalary : passiveSalary;
  return salaryArray[rankToIndex(rank)];
}
