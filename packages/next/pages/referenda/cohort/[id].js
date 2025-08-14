import SectionLayout from "next-common/components/layout/sectionLayout";
import { withCommonProps } from "next-common/lib";
import CohortBreadcrumb from "./breadcrumb";
import Overview from "./overview";
import ReferendaDVsVotes from "../dvs/dvVotes";
import Delegates from "../dvs/delegates/delegates";
import { TabTitle } from "../dvs/common/delegatesTabTitle";

export default function CohortPage() {
  return (
    <SectionLayout breadcrumbs={<CohortBreadcrumb />} hasSidebar>
      <div className="flex flex-col gap-y-6">
        <Overview />
        <DelegatesSection />
        <ReferendaDVsVotes />
      </div>
    </SectionLayout>
  );
}

function DelegatesSection() {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="mx-6">
        <TabTitle label="Delegates" length={0} disabled={false} />
      </div>
      <Delegates />
    </div>
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
