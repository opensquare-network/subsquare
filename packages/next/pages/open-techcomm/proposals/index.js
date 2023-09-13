import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import { useChain } from "next-common/context/chain";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeOpenTechCommProposalListItem from "next-common/utils/viewfuncs/collective/normalizeOpenTechCommProposalListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

export default function MotionsPage({ motions }) {
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
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();
  const motions = await fetchList("open-techcomm/motions", context);

  return {
    props: {
      ...tracksProps,
      motions,
    },
  };
});
