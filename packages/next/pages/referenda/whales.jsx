import ReferendaLayout from "next-common/components/layout/referendaLayout";
import nextApi from "next-common/services/nextApi";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import {
  gov2ReferendaHistoryWhalesApi,
  gov2ReferendaWhalesApi,
} from "next-common/services/url";

export default function ReferendaWhalesPage({ title, gov2ReferendaSummary }) {
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <div>whales</div>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps(async () => {
  const [{ result: whales }, { result: historyWhales }] = await Promise.all([
    nextApi.fetch(gov2ReferendaWhalesApi),
    nextApi.fetch(gov2ReferendaHistoryWhalesApi),
  ]);

  return {
    props: {
      whales,
      historyWhales,
    },
  };
});
