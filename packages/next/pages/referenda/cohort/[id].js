import SectionLayout from "next-common/components/layout/sectionLayout";
import { withCommonProps } from "next-common/lib";
import CohortBreadcrumb from "./breadcrumb";
import Overview from "./overview";
import ReferendaDVsVotes from "next-common/components/referenda/dvs/dvVotes";
import { TabTitle } from "next-common/components/referenda/dvs/common/delegatesTabTitle";
import Delegates from "next-common/components/referenda/dvs/delegates";
import { backendApi } from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import SwitchCountTab from "next-common/components/referenda/dvs/common/switchCountTab";
import ReferendaDvProvider from "next-common/context/referenda/dv";

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
  const { cohort } = usePageProps();
  if (isNil(cohort)) {
    return null;
  }
  return (
    <div className="flex flex-col gap-y-4">
      <ReferendaDvProvider>
        <SwitchCountTab className="mx-6">
          <TabTitle
            label="Delegates"
            length={cohort.delegates?.length || 0}
            disabled={false}
          />
        </SwitchCountTab>
        <Delegates />
      </ReferendaDvProvider>
    </div>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const baseUrl = `/dv/cohorts/${id}`;

  const [{ result: cohort }, { result: votes }, { result: referenda }] =
    await Promise.all([
      backendApi.fetch(baseUrl),
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
