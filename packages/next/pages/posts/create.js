import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import PostCreate from "next-common/components/post/postCreate";
import { useEffect } from "react";
import { useIsLogin } from "next-common/context/user";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

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
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
