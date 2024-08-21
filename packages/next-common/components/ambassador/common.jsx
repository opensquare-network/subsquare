import ListLayout from "next-common/components/layout/ListLayout";
import AmbassadorSalarySummary from "./summary";
import AmbassadorSalarySummaryActions from "./summary/actions";
import useFetchAmbassadorCollectiveMembers from "next-common/hooks/ambassador/collective/useFetchAmbassadorCollectiveMembers";
import useFetchAmbassadorSalaryClaimants from "next-common/hooks/ambassador/salary/useFetchAmbassadorSalaryClaimants";
import { MyAmbassadorSalaryClaimantProvider } from "next-common/context/ambassador/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";

export default function AmbassadorSalaryCommon({ children, ...props }) {
  const title = "Ambassador Salary";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };

  const { ambassadorParams } = usePageProps();

  useFetchAmbassadorSalaryClaimants();
  useSubFellowshipSalaryStats("ambassadorSalary");
  useFetchAmbassadorCollectiveMembers();

  return (
    <CollectivesProvider params={ambassadorParams} section="ambassador">
      <MyAmbassadorSalaryClaimantProvider>
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
            {
              label: "Feeds",
              url: "/ambassador/salary/feeds",
              exactMatch: true,
            },
          ]}
          {...props}
        >
          {children}
        </ListLayout>
      </MyAmbassadorSalaryClaimantProvider>
    </CollectivesProvider>
  );
}
