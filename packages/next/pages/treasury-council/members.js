import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import MembersNoElections from "components/council/membersNoElections";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default withLoginUserRedux(({ tracks, fellowshipTracks }) => {
  const category = "Treasury Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <MembersNoElections
        category={category}
        type={detailPageCategory.TREASURY_COUNCIL_MOTION}
      />
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
