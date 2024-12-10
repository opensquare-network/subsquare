import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipSalarySummary from "./summary";
import FellowshipSalarySummaryActions from "next-common/components/fellowship/salary/summary/actions";
import { MySalaryClaimantProvider } from "next-common/context/fellowship/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { upperFirst } from "lodash-es";

export default function FellowshipSalaryCommon({
  children,
  section = "fellowship",
  ...props
}) {
  const title = `${upperFirst(section)} Salary`;
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };
  const { fellowshipParams, ambassadorParams } = usePageProps();
  let params;
  if (section === "fellowship") {
    params = fellowshipParams;
  } else if (section === "ambassador") {
    params = ambassadorParams;
  }

  return (
    <CollectivesProvider params={params} section={section}>
      <MySalaryClaimantProvider>
        <ListLayout
          seoInfo={seoInfo}
          title={title}
          description={seoInfo.desc}
          summary={<FellowshipSalarySummary />}
          summaryFooter={<FellowshipSalarySummaryActions />}
          tabs={[
            {
              value: "cycles",
              label: "Cycles",
              url: `/${section}/salary`,
              exactMatch: true,
            },
            {
              value: "claimants",
              label: "Claimants",
              url: `/${section}/salary/claimants`,
              exactMatch: true,
            },
            {
              value: "feeds",
              label: "Feeds",
              url: `/${section}/salary/feeds`,
              exactMatch: true,
            },
          ]}
          {...props}
        >
          {children}
        </ListLayout>
      </MySalaryClaimantProvider>
    </CollectivesProvider>
  );
}
