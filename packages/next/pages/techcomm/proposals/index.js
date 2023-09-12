import PostList from "next-common/components/postList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

export default withLoginUserRedux(({ proposals, chain }) => {
  const items = (proposals.items || []).map((item) =>
    normalizeTechCommMotionListItem(chain, item),
  );
  const category = businessCategory.tcProposals;
  const seoInfo = {
    title: "Technical Committee Proposals",
    desc: "Technical Committee Proposals",
  };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Technical committee proposals"
    >
      <PostList
        category={category}
        title="List"
        titleCount={proposals.total}
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const proposals = await fetchList("tech-comm/motions", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      proposals,
      ...tracksProps,
    },
  };
});
