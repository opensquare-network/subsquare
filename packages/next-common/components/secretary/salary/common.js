import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipSalarySummary from "next-common/components/fellowship/salary/summary";
import { SecretaryMySalaryClaimantProvider } from "next-common/context/secretary/myClaimant";
import CollectivesProvider from "next-common/context/collectives/collectives";

const seoInfo = {
  title: "Secretary Salary",
  desc: "The salary pallet controls the periodic process of salary payments and members registration.",
};

export default function SecretarySalaryCommon({ children, ...props }) {
  return (
    <CollectivesProvider section="secretary">
      <SecretaryMySalaryClaimantProvider>
        <ListLayout
          seoInfo={seoInfo}
          title={seoInfo.title}
          description={seoInfo.desc}
          summary={<FellowshipSalarySummary />}
          tabs={[
            {
              value: "cycles",
              label: "Cycles",
              url: "/secretary/salary",
              exactMatch: true,
            },
            {
              value: "claimants",
              label: "Claimants",
              url: "/secretary/salary/claimants",
              exactMatch: true,
            },
            {
              value: "feeds",
              label: "Feeds",
              url: "/secretary/salary/feeds",
              exactMatch: true,
            },
          ]}
          {...props}
        >
          {children}
        </ListLayout>
      </SecretaryMySalaryClaimantProvider>
    </CollectivesProvider>
  );
}
