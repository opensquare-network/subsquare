import DetailLayout from "next-common/components/layout/DetailLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import SimaPostCreate from "next-common/components/sima/post/postCreate";

export default function PostCreatePage() {
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
      <SimaPostCreate />
    </DetailLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
