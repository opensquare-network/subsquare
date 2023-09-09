import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import ListLayout from "next-common/components/layout/ListLayout";
import Members from "components/council/members";
import MembersNoElections from "components/council/membersNoElections";
import isMoonChain from "next-common/utils/isMoonChain";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(() => {
  const category = "Council Members";
  const seoInfo = { title: category, desc: category };

  let members = <Members />;
  if (isMoonChain()) {
    members = <MembersNoElections type={detailPageCategory.COUNCIL_MOTION} />;
  }

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Council members"
    >
      {members}
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();
  return {
    props: {
      ...tracksProps,
    },
  };
});
