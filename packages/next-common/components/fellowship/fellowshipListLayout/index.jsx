import ListLayout from "next-common/components/layout/ListLayout";
import Gov2Summary from "next-common/components/summary/gov2Summary";
import FellowshipTrackSelect from "./trackSelect";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";

export default function FellowshipListLayout({ fellowshipSummary, children }) {
  const chain = useChain();

  const title = "Fellowship Referenda";
  const seoInfo = { title, desc: title };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      titleExtra={isCollectivesChain(chain) && <FellowshipTrackSelect />}
      description="All active and history referenda in various tracks."
      summary={<Gov2Summary summary={fellowshipSummary} />}
      tabs={[
        {
          value: "referenda",
          label: "Referenda",
          url: "/fellowship",
        },
        {
          value: "statistics",
          label: "Statistics",
          url: "/fellowship/referenda/statistics",
        },
      ].filter(Boolean)}
    >
      {children}
    </ListLayout>
  );
}
