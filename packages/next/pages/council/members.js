import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import Members from "components/council/members";
import MembersNoElections from "components/council/membersNoElections";
import isMoonChain from "next-common/utils/isMoonChain";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default withLoginUserRedux(({ tracks, fellowshipTracks }) => {
  const category = "Council Members";
  const seoInfo = { title: category, desc: category };

  let members = <Members category={category} />;
  if (isMoonChain()) {
    members = (
      <MembersNoElections
        category={category}
        type={detailPageCategory.COUNCIL_MOTION}
      />
    );
  }

  return (
    <HomeLayout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      {members}
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
