import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";

export function useMySalary() {
  const { members } = useFellowshipCollectiveMembers();
  const address = useRealAddress();
  const member = members.find((m) => isSameAddress(m.address, address));
  const params = useCoreFellowshipParams();

  const { member: coreMember, isLoading } = useSubFellowshipCoreMember(address);
  if (!member || !coreMember || isLoading) {
    return 0;
  }

  const { activeSalary = [], passiveSalary = [] } = params || {};
  const rank = member.rank;
  const { isActive } = coreMember || {};
  const salaryArray = isActive ? activeSalary : passiveSalary;
  return salaryArray[rankToIndex(rank)] || 0;
}

export function useMyAccountSalaryWithSymbol() {
  const salaryValue = useMySalary() ?? 0;
  const { decimals, symbol } = getSalaryAsset();

  return {
    value: salaryValue,
    decimals,
    symbol,
  };
}
