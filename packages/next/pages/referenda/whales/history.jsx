import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import WhalesContainer from "next-common/components/whales/container";
import dynamic from "next/dynamic";

const WhalesHistoryList = dynamic(
  () => import("next-common/components/whales/historyList"),
  {
    ssr: false,
  },
);

export default function ReferendaWhalesHistoryPage({
  gov2ReferendaSummary,
}) {
  const seoInfo = { title : "Referenda Whales History"  , desc: "View the history of referenda whales" };

  return (
    <ReferendaLayout
      title={seoInfo.title}
      description={seoInfo.desc}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <WhalesContainer>
        <WhalesHistoryList />
      </WhalesContainer>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps();
