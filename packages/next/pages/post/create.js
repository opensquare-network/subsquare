import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import PostCreate from "next-common/components/post/postCreate";
import { useEffect } from "react";
import { useIsLogin } from "next-common/context/user";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";

export default withLoginUserRedux(() => {
  const isLogin = useIsLogin();
  const { openLoginPopup } = useLoginPopup();

  useEffect(() => {
    if (!isLogin) {
      openLoginPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  const breadcrumbItems = [
    {
      content: "Discussions",
      path: "/discussions",
    },
    {
      content: "New Post",
    },
  ];

  return (
    <DetailLayout
      breadcrumbs={breadcrumbItems}
      seoInfo={{
        title: "Create post",
      }}
    >
      <PostCreate />
    </DetailLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
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
