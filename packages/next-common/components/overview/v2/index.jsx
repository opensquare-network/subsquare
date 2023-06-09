import clsx from "clsx";
import sumBy from "lodash.sumby";
import ChainInfo from "next-common/components/chain/info";
import PostList from "next-common/components/postList";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import EmptyOverview from "../emptyOverview";

export default function Overview({ overviewData, summaryData }) {
  const chain = useChain();
  const allCategoriesCount = sumBy(overviewData ?? [], (item) => {
    return item?.items?.length;
  });

  const SummaryComponent = isCollectivesChain(chain)
    ? AllianceOverviewSummary
    : OverviewSummary;

  const content =
    allCategoriesCount <= 0 ? (
      <EmptyOverview />
    ) : (
      overviewData?.map?.((item) => (
        <PostList
          key={item.category}
          category={item.category}
          link={item.link}
          items={item.items}
          type={item.type}
        />
      ))
    );

  return (
    <div>
      <div className={clsx("px-6 bg-neutral100", "max-sm:px-0")}>
        <div className="p-6">
          <ChainInfo />

          <hr className="h-px my-4 bg-neutral300" />

          <div>
            <SummaryComponent summaryData={summaryData} />
          </div>
        </div>
      </div>

      <div className={clsx("px-6 my-6 space-y-6", "max-sm:px-0")}>
        {content}
      </div>
    </div>
  );
}
