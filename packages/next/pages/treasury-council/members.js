import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import MembersNoElections from "components/council/membersNoElections";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(() => {
  const category = "Treasury Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Treasury council members"
    >
      <MembersNoElections
        category={category}
        type={detailPageCategory.TREASURY_COUNCIL_MOTION}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
