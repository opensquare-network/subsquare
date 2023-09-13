import PostList from "next-common/components/postList";
import { withLoginUser } from "next-common/lib";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTreasuryCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTreasuryCouncilMotionListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

export default function MotionsPage({ motions, chain }) {
  const items = (motions.items || []).map((item) =>
    normalizeTreasuryCouncilMotionListItem(chain, item),
  );
  const category = businessCategory.treasuryCouncilMotions;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Treasury council motions"
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

export const getServerSideProps = withLoginUser(async (context) => {
  const motions = await fetchList("motions", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      motions,
      ...tracksProps,
    },
  };
});
