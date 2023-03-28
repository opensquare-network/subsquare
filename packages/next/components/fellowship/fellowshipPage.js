import HomeLayout from "next-common/components/layout/HomeLayout";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";

export default function FellowshipPage({
  posts,
  title,
  tracks,
  fellowshipTracks,
  summary,
}) {
  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks)
  );

  return (
    <HomeLayout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <PostList
        title={title}
        category={businessCategory.fellowship}
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
