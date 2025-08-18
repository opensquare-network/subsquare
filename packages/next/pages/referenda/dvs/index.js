import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import DelegatesContainer from "next-common/components/referenda/dvs/delegates";
import ReferendaDVsVotes from "next-common/components/referenda/dvs/dvVotes";
import { backendApi } from "next-common/services/nextApi";

export default function ReferendaWhalesPage({ title, gov2ReferendaSummary }) {
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <div className="gap-y-6 flex flex-col">
        <DelegatesContainer />
        <ReferendaDVsVotes />
      </div>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps(async () => {
  const { result: cohorts } = await backendApi.fetch("/dv/cohorts");
  const cohortsCount = cohorts?.length || 0;

  return {
    props: {
      cohorts,
      cohortsCount,
    },
  };
});
