import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";

export default function useMySalary() {
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

  const { member: coreMember, isLoading } =
    useMySalaryClaimantFromContext() ?? { member: null };
  if (!member || !coreMember || isLoading) {
    return 0;
  }

  const { activeSalary = [], passiveSalary = [] } = params || {};
  const rank = member.rank;
  const { isActive } = coreMember || {};
  const salaryArray = isActive ? activeSalary : passiveSalary;

  return salaryArray[rankToIndex(rank)];
}
