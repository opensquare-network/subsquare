import FinancialCouncilMotionPostList from "next-common/components/postList/financialCouncilMotionPostList";
import { withCommonProps } from "next-common/lib";
import { toFinancialMotionsListItem } from "next-common/utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function MotionsPage({ motions }) {
  const items = (motions.items || []).map((item) =>
    toFinancialMotionsListItem(item),
  );
  const category = businessCategory.financialMotions;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Financial council motions"
    >
      <FinancialCouncilMotionPostList
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
  const motions = await fetchList("financial-motions", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      motions,
      ...tracksProps,
    },
  };
});
