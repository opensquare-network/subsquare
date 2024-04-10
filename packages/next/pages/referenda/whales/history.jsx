import ReferendaLayout from "next-common/components/layout/referendaLayout";
import nextApi from "next-common/services/nextApi";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import { gov2ReferendaHistoryWhalesApi } from "next-common/services/url";
import WhalesContainer from "next-common/components/whales/container";
import WhalesHistoryList from "next-common/components/whales/historyList";

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

export const getServerSideProps = withReferendaCommonProps(async () => {
  const { result: historyWhales } = await nextApi.fetch(
    gov2ReferendaHistoryWhalesApi,
  );

  return {
    props: {
      historyWhales,
    },
  };
});
