import DetailLayout from "next-common/components/layout/DetailLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import CreateFellowshipApplication from "next-common/components/fellowship/applications/create";

export default function CreateFellowshipApplicationPage() {
  const breadcrumbItems = [
    {
      content: "Applications",
      path: "/fellowship/applications",
    },
    {
      content: "New Application",
    },
  ];

  return (
    <DetailLayout
      breadcrumbs={breadcrumbItems}
      seoInfo={{
        title: "New Application",
      }}
    >
      <CreateFellowshipApplication />
    </DetailLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
