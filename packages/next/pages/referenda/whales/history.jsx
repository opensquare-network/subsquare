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

export const getServerSideProps = withReferendaCommonProps(function () {
  return {
    props: {
      title: "Referenda Whales History",
    },
  };
});
