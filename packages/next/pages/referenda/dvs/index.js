import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import ReferendaDVsTabs from "next-common/components/referenda/dvs/tabs";
import { backendApi } from "next-common/services/nextApi";
import { isNil } from "lodash-es";

export default function ReferendaWhalesPage({ title, gov2ReferendaSummary }) {
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <div className="gap-y-6 flex flex-col">
        <ReferendaDVsTabs />
      </div>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps(async () => {
  const { result: cohorts = [] } = await backendApi.fetch("/dv/cohorts");
  const cohortsCount = cohorts?.length || 0;
  const activeCohort = cohorts?.find((cohort) => isNil(cohort.endIndexer));
  let cohort = null;
  let votes = [];
  let referenda = [];

  if (activeCohort) {
    const [
      { result: cohortResult },
      { result: votesResult },
      { result: referendaResult },
    ] = await Promise.all([
      backendApi.fetch(`/dv/cohorts/${activeCohort.id}`),
      backendApi.fetch(`/dv/cohorts/${activeCohort.id}/votes`),
      backendApi.fetch(`/dv/cohorts/${activeCohort.id}/referenda`),
    ]);
    cohort = cohortResult;
    votes = votesResult;
    referenda = referendaResult;
  }

  return {
    props: {
      cohort,
      cohorts,
      cohortsCount,
      votes,
      referenda,
    },
  };
});
