import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";
import { toGov2ReferendaListItem } from "utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";

export default function Gov2Page({
  posts,
  title,
  tracks,
  fellowshipTracks,
  summary,
}) {
  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    toGov2ReferendaListItem(item, tracks)
  );

  return (
    <Gov2Layout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <PostList
        title={title}
        category={businessCategory.openGovReferenda}
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
