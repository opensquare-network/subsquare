import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";

export default function ReferendaWhalesPage({ gov2ReferendaSummary }) {
  return (
    <ReferendaLayout summaryData={gov2ReferendaSummary}>
      <div>whales</div>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps();
