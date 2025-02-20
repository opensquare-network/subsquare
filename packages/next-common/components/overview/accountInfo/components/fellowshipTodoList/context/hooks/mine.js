import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";
import { useContextCoreMembers } from "../coreMembers";
import { useContextCollectivesMembers } from "../collectivesMember";
import { useContextMySalaryClaimant } from "../mySalaryClaimant";
import { useContextSalaryStats } from "../salaryStats";
import { useContextCoreParams } from "../coreParams";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";

export function useContextMyCoreMember() {
  const realAddress = useRealAddress();
  const { members } = useContextCoreMembers();

  return useMemo(
    () => (members || []).find((m) => isSameAddress(m.address, realAddress)),
    [realAddress, members],
  );
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
  const realAddress = useRealAddress();
  const { members } = useContextCollectivesMembers();

  return useMemo(
    () => (members || []).find((m) => isSameAddress(m.address, realAddress)),
    [realAddress, members],
  );
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
  const status = useContextSalaryStats();
  const { claimant } = useContextMySalaryClaimant();
  if (!status || !claimant) {
    return false;
  }
  return claimant.lastActive >= status?.cycleIndex;
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
