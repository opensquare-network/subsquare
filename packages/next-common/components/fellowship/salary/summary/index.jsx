import { has, partition } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useFellowSalaryClaimantsData } from "next-common/hooks/fellowship/salary/useFellowshipSalaryClaimantsData";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function FellowshipSalarySummary() {
  const { fellowshipMembers } = usePageProps();
  const fellowshipSalaryClaimants = useFellowSalaryClaimantsData();
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const { activeCycle } = usePageProps();
  const cycleIndex = activeCycle?.index || stats?.cycleIndex;

  const [registeredClaimants] = partition(
    fellowshipSalaryClaimants,
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
        {fellowshipSalaryClaimants?.length || 0}
      </SummaryItem>
      <SummaryItem title="Registered">
        {registeredClaimants.length || 0}
      </SummaryItem>
      <SummaryItem title="Not Inducted">
        {fellowshipMembers?.length - fellowshipSalaryClaimants?.length}
      </SummaryItem>
    </SummaryLayout>
  );
}
