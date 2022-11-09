import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";
import { toGov2ReferendaListItem } from "utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";
import { useChain } from "next-common/context/chain";

export default function Gov2Page({ posts, title, tracks, summary }) {
  const chain = useChain();
  // FIXME: seo
  const seoInfo = { title, desc: "" };
  const items = (posts.items || []).map((item) =>
    toGov2ReferendaListItem(chain, item, tracks)
  );

  return (
    <Gov2Layout seoInfo={seoInfo} tracks={tracks}>
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
