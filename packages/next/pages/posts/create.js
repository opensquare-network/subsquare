import PostCreate from "next-common/components/post/postCreate";
import { useEffect } from "react";
import { useUser } from "next-common/context/user";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default function PostCreatePage() {
  const user = useUser();
  const { openLoginPopup } = useLoginPopup();

  useEffect(() => {
    if (!user) {
      openLoginPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
}

export const getServerSideProps = getServerSidePropsWithTracks;
