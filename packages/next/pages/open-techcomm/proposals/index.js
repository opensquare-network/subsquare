import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { useChain } from "next-common/context/chain";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeOpenTechCommProposalListItem from "next-common/utils/viewfuncs/collective/normalizeOpenTechCommProposalListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(({ motions }) => {
  const chain = useChain();
  const items = (motions.items || []).map((item) =>
    normalizeOpenTechCommProposalListItem(chain, item),
  );
  const category = businessCategory.openTechCommitteeProposals;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Open technical committee proposals"
    >
      <PostList
        category={category}
        title="List"
        titleCount={motions.total}
        items={items}
        pagination={{
          page: motions.page,
          pageSize: motions.pageSize,
          total: motions.total,
        }}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;
  const tracksProps = await fetchOpenGovTracksProps();

  const [{ result: motions }] = await Promise.all([
    nextApi.fetch("open-techcomm/motions", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
  ]);

  return {
    props: {
      ...tracksProps,
      motions: motions ?? EmptyList,
    },
  };
});
