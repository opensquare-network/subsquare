import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";
import { toFellowshipReferendaListItem } from "utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";

export default function FellowshipPage({
  posts,
  title,
  tracks,
  fellowshipTracks,
  summary,
}) {
  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    toFellowshipReferendaListItem(item, fellowshipTracks)
  );

  return (
    <Gov2Layout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <PostList
        title={title}
        category={businessCategory.gov2}
        create={null}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
        summary={summary}
      />
    </Gov2Layout>
  );
}
