import HomeLayout from "next-common/components/layout/HomeLayout";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";

/**
 * @description ReferendaPage
 */
export default function Gov2Page({
  posts,
  title,
  tracks,
  fellowshipTracks,
  summary,
}) {
  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    normalizeGov2ReferendaListItem(item, tracks)
  );

  return (
    <HomeLayout
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
    </HomeLayout>
  );
}
