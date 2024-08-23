import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipSalarySummary from "./summary";
import useFetchFellowshipSalaryClaimants from "next-common/hooks/fellowship/salary/useFetchFellowshipSalaryClaimants";
import FellowshipSalarySummaryActions from "next-common/components/fellowship/salary/summary/actions";
import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";
import { MySalaryClaimantProvider } from "next-common/context/fellowship/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";

export default function FellowshipSalaryCommon({ children, ...props }) {
  const title = "Fellowship Salary";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };
  const { fellowshipParams } = usePageProps();
  useFetchFellowshipSalaryClaimants();
  useSubFellowshipSalaryStats();

  return (
    <CollectivesProvider params={fellowshipParams}>
      <MySalaryClaimantProvider>
        <ListLayout
          seoInfo={seoInfo}
          title={title}
          description={seoInfo.desc}
          summary={<FellowshipSalarySummary />}
          summaryFooter={<FellowshipSalarySummaryActions />}
          tabs={[
            {
              label: "Cycles",
              url: "/fellowship/salary",
              exactMatch: true,
            },
            {
              label: "Claimants",
              url: "/fellowship/salary/claimants",
              exactMatch: true,
            },
            {
              label: "Feeds",
              url: "/fellowship/salary/feeds",
              exactMatch: true,
            },
          ].filter(Boolean)}
          {...props}
        >
          {children}
        </ListLayout>
      </MySalaryClaimantProvider>
    </CollectivesProvider>
  );
}
