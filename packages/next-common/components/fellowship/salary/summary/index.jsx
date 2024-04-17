import { has, partition } from "lodash-es";
import Summary from "next-common/components/summary";
import { usePageProps } from "next-common/context/page";
import { useFellowSalaryClaimantsData } from "next-common/hooks/fellowship/salary/useFellowshipSalaryClaimantsData";

export default function FellowshipSalarySummary() {
  const { fellowshipMembers } = usePageProps();
  const fellowshipSalaryClaimants = useFellowSalaryClaimantsData();

  const [registeredClaimants] = partition(
    fellowshipSalaryClaimants,
    (claimant) => {
      return (
        has(claimant?.status?.status, "registered") ||
        has(claimant?.status?.status, "attempted")
      );
    },
  );

  const items = [
    {
      title: "Claimants",
      content: fellowshipSalaryClaimants?.length || 0,
    },
    {
      title: "Registered",
      content: registeredClaimants.length,
    },
    {
      title: "Not Inducted",
      content: fellowshipMembers?.length - fellowshipSalaryClaimants?.length,
    },
  ];

  return <Summary items={items} />;
}
