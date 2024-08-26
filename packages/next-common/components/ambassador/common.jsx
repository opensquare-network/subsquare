import ListLayout from "next-common/components/layout/ListLayout";
import AmbassadorSalarySummary from "./summary";
import AmbassadorSalarySummaryActions from "./summary/actions";
import { MyAmbassadorSalaryClaimantProvider } from "next-common/context/ambassador/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";

export default function AmbassadorSalaryCommon({ children, ...props }) {
  const { ambassadorParams } = usePageProps();

  return (
    <CollectivesProvider params={ambassadorParams} section="ambassador">
      <AmbassadorSalaryCommonImpl {...props}>
        {children}
      </AmbassadorSalaryCommonImpl>
      ;
    </CollectivesProvider>
  );
}

function AmbassadorSalaryCommonImpl({ children, ...props }) {
  const title = "Ambassador Salary";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };

  return (
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
  );
}
