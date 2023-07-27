import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import ListLayout from "next-common/components/layout/ListLayout";
import PreImagesList from "components/preImages/preImagesList";
import usePreimageHashs from "hooks/usePreimageHashs";

export default withLoginUserRedux(({ title }) => {
  const seoInfo = { title, desc: title };

  const hashs = usePreimageHashs();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title="Preimages"
      description="Preimage can be submitted and stored on-chain against the hash later, upon the proposal's dispatch."
    >
      <PreImagesList data={hashs} />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      title: "Preimages",
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
