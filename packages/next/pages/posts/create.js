import PostCreate from "next-common/components/post/postCreate";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

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
      <PostCreate />
    </DetailLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
