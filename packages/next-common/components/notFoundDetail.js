import DetailLayout from "next-common/components/layout/DetailLayout";
import NotFound from "next-common/components/notFound";
import Breadcrumb from "next-common/components/_Breadcrumb";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import { usePageProps } from "next-common/context/page";

export default function NotFoundDetail({ breadcrumbItems = [], hasSidebar }) {
  const { id } = usePageProps();
  return (
    <DetailLayout
      breadcrumbs={
        <BreadcrumbWrapper>
          <Breadcrumb
            items={[
              ...breadcrumbItems,
              {
                content: `#${id}`,
              },
            ]}
          />
        </BreadcrumbWrapper>
      }
      hasSidebar={hasSidebar}
    >
      <NotFound />
    </DetailLayout>
  );
}
