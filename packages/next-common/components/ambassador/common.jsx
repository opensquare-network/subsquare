import ListLayout from "next-common/components/layout/ListLayout";
import AmbassadorSalarySummary from "./summary";
import AmbassadorSalarySummaryActions from "./summary/actions";

export default function AmbassadorSalaryCommon({ children, ...props }) {
  const title = "Ambassador Salary";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };

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
      ]}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
