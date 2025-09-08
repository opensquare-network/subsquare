import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import { backendApi } from "next-common/services/nextApi";
import { isNil } from "lodash-es";
import DecentralizedVoices from "next-common/components/referenda/dv/decentralizedVoices";

export default function ReferendaDvPage({ title, gov2ReferendaSummary }) {
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <DecentralizedVoices />
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
      title: "Decentralized Voices",
      cohort,
      cohorts,
      cohortsCount,
      votes,
      referenda,
    },
  };
});
