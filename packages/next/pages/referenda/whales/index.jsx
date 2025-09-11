import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import WhalesContainer from "next-common/components/whales/container";
import dynamic from "next/dynamic";

const WhalesCurrentList = dynamic(
  () => import("next-common/components/whales/currentList"),
  {
    ssr: false,
  },
);

export default function ReferendaWhalesPage({ gov2ReferendaSummary }) {
  const seoInfo = { title: "Referenda Whales", desc: "View the current referenda whales" };

  return (
    <ReferendaLayout
      title={seoInfo.title}
      description={seoInfo.desc}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <WhalesContainer>
        <WhalesCurrentList />
      </WhalesContainer>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps();
