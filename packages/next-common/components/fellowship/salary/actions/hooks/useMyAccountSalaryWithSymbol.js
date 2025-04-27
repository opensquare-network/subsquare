import { useState, useEffect } from "react";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { toPrecision } from "next-common/utils";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import { usePageProps } from "next-common/context/page";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";

export function useMySalary() {
  const { section } = useCollectivesContext();
  const { members } = useFellowshipCollectiveMembers();
  const address = useRealAddress();
  const member = members.find((m) => isSameAddress(m.address, address));
  const { fellowshipParams, ambassadorParams } = usePageProps();

  let params;
  if (section === "fellowship") {
    params = fellowshipParams;
  } else if (section === "ambassador") {
    params = ambassadorParams;
  }

  const { member: coreMember, isLoading } = useMySalaryClaimantFromContext();
  if (!member || !coreMember || isLoading) {
    return 0;
  }

  const { activeSalary = [], passiveSalary = [] } = params || {};
  const rank = member.rank;
  const { isActive } = coreMember || {};
  const salaryArray = isActive ? activeSalary : passiveSalary;
  return salaryArray[rankToIndex(rank)];
}

export function useMyAccountSalaryWithSymbol() {
  const salaryValue = useMySalary() ?? 0;
  const [mySalary, setMySalary] = useState(null);
  const { decimals, symbol } = getSalaryAsset();
  useEffect(() => {
    setMySalary({
      value: salaryValue,
      formatted: salaryValue
        ? abbreviateBigNumber(toPrecision(salaryValue, decimals), 2)
        : "0",
      decimals,
      symbol,
    });
  }, [decimals, salaryValue, symbol]);

  return {
    ...mySalary,
  };
}
