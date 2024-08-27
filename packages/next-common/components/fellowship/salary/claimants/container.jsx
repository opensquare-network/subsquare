import { useFellowshipSalaryClaimants } from "next-common/hooks/fellowship/salary/useFellowshipSalaryClaimants";
import FellowshipSalaryActiveCycle from "../cycles/current";
import FellowshipSalaryClaimantsList from "./list";
import { usePageProps } from "next-common/context/page";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function FellowshipSalaryClaimantsContainer() {
  const { section } = useCollectivesContext();
  const { claimants } = useFellowshipSalaryClaimants();
  const {
    fellowshipParams,
    ambassadorParams,
    fellowshipMembers,
    ambassadorMembers,
  } = usePageProps();

  let params;
  let members;
  if (section === "fellowship") {
    params = fellowshipParams;
    members = fellowshipMembers;
  } else if (section === "ambassador") {
    params = ambassadorParams;
    members = ambassadorMembers;
  }

  return (
    <div className="space-y-6">
      <FellowshipSalaryActiveCycle />
      <FellowshipSalaryClaimantsList
        claimants={claimants}
        params={params}
        members={members}
      />
    </div>
  );
}
