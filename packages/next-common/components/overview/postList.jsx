import sumBy from "lodash.sumby";
import PostList from "../postList";
import EmptyOverview from "./emptyOverview";
import NewOverview from "./newOverview";

export default function OverviewPostList({ overviewData = [] }) {
  const allCategoriesCount = sumBy(overviewData ?? [], (item) => {
    return item?.items?.length;
  });

  // TODO: overview, remove this
  const content =
    false ??
    (allCategoriesCount <= 0 ? (
      <EmptyOverview />
    ) : (
      overviewData?.map?.((item) => (
        <PostList
          key={item.category}
          category={item.category}
          title={item.category}
          link={item.link}
          items={item.items}
          type={item.type}
        />
      ))
    ));

  return (
    <div className="space-y-6">
      <NewOverview />

      {content}
    </div>
  );
}
