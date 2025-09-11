import DetailLayout from "next-common/components/layout/DetailLayout";
import { useChainSettings } from "next-common/context/chain";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import SimaPostCreate from "next-common/sima/components/post/postCreate";
import PostCreate from "next-common/components/post/postCreate";

export default function PostCreatePage() {
  const { sima } = useChainSettings();

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
      {sima ? <SimaPostCreate /> : <PostCreate />}
    </DetailLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
