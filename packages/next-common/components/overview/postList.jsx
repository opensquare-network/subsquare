import sumBy from "lodash.sumby";
import PostList from "../postList";
import EmptyOverview from "./emptyOverview";

export default function OverviewPostList({ overviewData = [] }) {
  const allCategoriesCount = sumBy(overviewData ?? [], (item) => {
    return item?.items?.length;
  });

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

  return <div className="space-y-6">{content}</div>;
}
