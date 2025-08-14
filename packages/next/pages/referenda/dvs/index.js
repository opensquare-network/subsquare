import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import DVApplyPrompt from "./dvApplyPrompt";
import DelegatesContainer from "./delegates";
import ReferendaDVsVotes from "./dvVotes";

export default function ReferendaWhalesPage({ title, gov2ReferendaSummary }) {
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <div className="gap-y-6 flex flex-col">
        <DVApplyPrompt />
        <DelegatesContainer />
        <ReferendaDVsVotes />
      </div>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps();
