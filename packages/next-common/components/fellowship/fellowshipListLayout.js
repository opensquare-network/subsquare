import ListLayout from "next-common/components/layout/ListLayout";
import Gov2Summary from "next-common/components/summary/gov2Summary";

export default function FellowshipListLayout({ fellowshipSummary, children }) {
  const title = "Fellowship Referenda";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="All active and history referenda in various tracks."
      summary={<Gov2Summary summary={fellowshipSummary} />}
      tabs={[
        { label: "Referenda", url: "/fellowship" },
        { label: "Statistics", url: "/fellowship/referenda/statistics" },
      ].filter(Boolean)}
    >
      {children}
    </ListLayout>
  );
}
