import { has, partition } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useFellowshipSalaryClaimants } from "next-common/hooks/fellowship/salary/useFellowshipSalaryClaimants";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function FellowshipSalarySummary() {
  const { section } = useCollectivesContext();
  const { fellowshipMembers, ambassadorMembers } = usePageProps();

  let members;
  if (section === "fellowship") {
    members = fellowshipMembers;
  } else if (section === "ambassador") {
    members = ambassadorMembers;
  }

  const { claimants } = useFellowshipSalaryClaimants();
  const stats = useFellowshipSalaryStats();

  const { activeCycle } = usePageProps();
  const cycleIndex = activeCycle?.index || stats?.cycleIndex;

  const [registeredClaimants] = partition(claimants, (claimant) => {
    return (
      claimant?.status?.lastActive >= cycleIndex &&
      (has(claimant?.status?.status, "registered") ||
        has(claimant?.status?.status, "attempted"))
    );
  });

  return (
    <SummaryLayout>
      <SummaryItem title="Claimants">{claimants?.length || 0}</SummaryItem>
      <SummaryItem title="Registered">
        {registeredClaimants.length || 0}
      </SummaryItem>
      <SummaryItem title="Not Inducted">
        {members?.length - claimants?.length}
      </SummaryItem>
    </SummaryLayout>
  );
}
