import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import { backendApi } from "next-common/services/nextApi";
import { isNil } from "lodash-es";
import DecentralizedVoices from "next-common/components/referenda/dv/decentralizedVoices";

export default function ReferendaDvPage({ gov2ReferendaSummary }) {
  const seoInfo = {
    title: "Decentralized Voices",
    desc: "The Decentralized Voices program empowers broader community participation in Polkadot OpenGov by delegating tokens to delegates.",
  };

  return (
    <ReferendaLayout
      title={seoInfo.title}
      description={seoInfo.desc}
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
      cohort,
      cohorts,
      cohortsCount,
      votes,
      referenda,
    },
  };
});
