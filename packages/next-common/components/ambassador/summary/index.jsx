import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useAmbassadorSalaryClaimantsData } from "next-common/hooks/ambassador/summary/useAmbassadorSalaryClaimantsData";
import { usePageProps } from "next-common/context/page";
import { useSelector } from "react-redux";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import { has, partition } from "lodash-es";

export default function AmbassadorSalarySummary() {
  const { ambassadorMembers, activeCycle } = usePageProps();
  const ambassadorSalaryClaimants = useAmbassadorSalaryClaimantsData();
  const stats = useSelector(ambassadorSalaryStatusSelector);
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
