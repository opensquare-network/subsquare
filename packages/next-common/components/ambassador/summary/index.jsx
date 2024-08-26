import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { usePageProps } from "next-common/context/page";
import { has, partition } from "lodash-es";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { useFellowshipSalaryClaimants } from "../../../hooks/fellowship/salary/useFellowshipSalaryClaimants";

export default function AmbassadorSalarySummary() {
  const { ambassadorMembers, activeCycle } = usePageProps();
  const { claimants: ambassadorSalaryClaimants } =
    useFellowshipSalaryClaimants();
  const stats = useFellowshipSalaryStats();
  const cycleIndex = activeCycle?.index || stats?.cycleIndex;

  const [registeredClaimants] = partition(
    ambassadorSalaryClaimants,
    (claimant) => {
      return (
        claimant?.status?.lastActive >= cycleIndex &&
        (has(claimant?.status?.status, "registered") ||
          has(claimant?.status?.status, "attempted"))
      );
    },
  );

  return (
    <SummaryLayout>
      <SummaryItem title="Claimants">
        {ambassadorSalaryClaimants?.length || 0}
      </SummaryItem>
      <SummaryItem title="Registered">
        {registeredClaimants.length || 0}
      </SummaryItem>
      <SummaryItem title="Not Inducted">
        {ambassadorMembers?.length - ambassadorSalaryClaimants?.length || 0}
      </SummaryItem>
    </SummaryLayout>
  );
}
