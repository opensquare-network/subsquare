import SectionLayout from "next-common/components/layout/sectionLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import CohortBreadcrumb from "next-common/components/referenda/dv/cohort/breadcrumb";
import Overview from "next-common/components/referenda/dv/cohort/overview";
import DvReferendaVotes from "next-common/components/referenda/dv/dvVotes";
import { TabTitle } from "next-common/components/referenda/dv/common/delegatesTabTitle";
import Delegates from "next-common/components/referenda/dv/delegates";
import { backendApi } from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import Breadcrumbs from "next-common/components/layout/DetailLayout/breadcrumbs";
import CountBySelect from "next-common/components/referenda/dv/common/countBySelect";
import DvDataTypeProvider from "next-common/context/referenda/dv";
import NotFound from "next-common/components/notFound";
import Influence from "next-common/components/referenda/dv/influence";

function NilCohortPage() {
  return (
    <SectionLayout>
      <Breadcrumbs breadcrumbs={<CohortBreadcrumb />} />
      <NotFound className="py-10" />
    </SectionLayout>
  );
}

export default function CohortPage() {
  const { cohort } = usePageProps();

  if (isNil(cohort)) {
    return <NilCohortPage />;
  }

  return (
    <SectionLayout>
      <DvDataTypeProvider>
        <CountBySelect
          className="mx-0 mb-4"
          selectClassName="max-sm:ml-12 mr-6"
        >
          <Breadcrumbs
            className="mb-0 flex-1"
            breadcrumbs={<CohortBreadcrumb />}
          />
        </CountBySelect>
        <div className="flex flex-col gap-y-4">
          <Overview />
          <DelegatesSection />
          <DvReferendaVotes />
          <Influence />
        </div>
      </DvDataTypeProvider>
    </SectionLayout>
  );
}

function DelegatesSection() {
  const { cohort } = usePageProps();

  return (
    <div className="flex flex-col gap-y-4">
      <TabTitle
        label="Delegates"
        length={cohort.delegates?.length || 0}
        disabled={false}
        className="mx-6"
      />
      <Delegates />
    </div>
  );
}

export const getServerSideProps = withReferendaCommonProps(async (context) => {
  const { id } = context.query;
  const baseUrl = `/dv/cohorts/${id}`;

  const { result: cohort } = await backendApi.fetch(baseUrl);
  if (isNil(cohort)) {
    return {
      props: {
        id,
      },
    };
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
