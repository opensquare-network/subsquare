import SectionLayout from "next-common/components/layout/sectionLayout";
import { withCommonProps } from "next-common/lib";
import CohortBreadcrumb from "./breadcrumb";
import Overview from "./overview";

export default function CohortPage() {
  return (
    <SectionLayout breadcrumbs={<CohortBreadcrumb />} hasSidebar>
      <Overview />
    </SectionLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    },
  };
});
