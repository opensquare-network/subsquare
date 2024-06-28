import ListLayout from "next-common/components/layout/ListLayout";
import AmbassadorSalarySummary from "./summary";
import AmbassadorSalarySummaryActions from "./summary/actions";
import useSubAmbassadorSalaryStats from "next-common/hooks/ambassador/salary/useSubAmbassadorSalaryStats";
import useFetchAmbassadorCollectiveMembers from "next-common/hooks/ambassador/collective/useFetchAmbassadorCollectiveMembers";
import useFetchAmbassadorSalaryClaimants from "next-common/hooks/ambassador/salary/useFetchAmbassadorSalaryClaimants";

export default function AmbassadorSalaryCommon({ children, ...props }) {
  const title = "Ambassador Salary";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };

  useFetchAmbassadorSalaryClaimants();
  useSubAmbassadorSalaryStats();
  useFetchAmbassadorCollectiveMembers();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      summary={<AmbassadorSalarySummary />}
      summaryFooter={<AmbassadorSalarySummaryActions />}
      tabs={[
        {
          label: "Cycles",
          url: "/ambassador/salary",
          exactMatch: true,
        },
        {
          label: "Claimants",
          url: "/ambassador/salary/claimants",
          exactMatch: true,
        },
      ]}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
