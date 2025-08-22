import SectionLayout from "next-common/components/layout/sectionLayout";
import { withCommonProps } from "next-common/lib";
import CohortBreadcrumb from "next-common/components/referenda/dv/cohort/breadcrumb";
import Overview from "next-common/components/referenda/dv/cohort/overview";
import ReferendaDvVotes from "next-common/components/referenda/dv/dvVotes";
import { TabTitle } from "next-common/components/referenda/dv/common/delegatesTabTitle";
import Delegates from "next-common/components/referenda/dv/delegates";
import { backendApi } from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import CountBySelect from "next-common/components/referenda/dv/common/countBySelect";
import ReferendaDvProvider from "next-common/context/referenda/dv";
import { to404 } from "next-common/utils/serverSideUtil";

export default function CohortPage() {
  return (
    <SectionLayout breadcrumbs={<CohortBreadcrumb />} hasSidebar>
      <div className="flex flex-col gap-y-6">
        <ReferendaDvProvider>
          <Overview />
          <DelegatesSection />
        </ReferendaDvProvider>
        <ReferendaDvVotes />
      </div>
    </SectionLayout>
  );
}

function DelegatesSection() {
  const { cohort } = usePageProps();
  if (isNil(cohort)) {
    return null;
  }
  return (
    <div className="flex flex-col gap-y-4">
      <CountBySelect className="mx-6">
        <TabTitle
          label="Delegates"
          length={cohort.delegates?.length || 0}
          disabled={false}
        />
      </CountBySelect>
      <Delegates />
    </div>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const baseUrl = `/dv/cohorts/${id}`;

  const { result: cohort } = await backendApi.fetch(baseUrl);
  if (isNil(cohort)) {
    return to404();
  }

  const [{ result: votes }, { result: referenda }] = await Promise.all([
    backendApi.fetch(`${baseUrl}/votes`),
    backendApi.fetch(`${baseUrl}/referenda`),
  ]);

  return {
    props: {
      id,
      cohort,
      votes,
      referenda,
    },
  };
});
