import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import WhalesContainer from "next-common/components/whales/container";
import WhalesHistoryList from "next-common/components/whales/historyList";
import {
  fetchReferendaWhales,
  fetchReferendaWhalesHistory,
} from "next-common/services/serverSide/referenda/whales";

export default function ReferendaWhalesHistoryPage({
  title,
  gov2ReferendaSummary,
}) {
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <WhalesContainer>
        <WhalesHistoryList />
      </WhalesContainer>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps(async (ctx) => {
  const page = ctx.query.page || 1;

  const [{ result: whales }, { result: historyWhales }] = await Promise.all([
    fetchReferendaWhales(1, 1),
    fetchReferendaWhalesHistory(page, 25),
  ]);

  return {
    props: {
      whales,
      historyWhales,
    },
  };
});
