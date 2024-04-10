import ReferendaLayout from "next-common/components/layout/referendaLayout";
import nextApi from "next-common/services/nextApi";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";
import { gov2ReferendaWhalesApi } from "next-common/services/url";
import WhalesContainer from "next-common/components/whales/container";
import WhalesCurrentList from "next-common/components/whales/currentList";

export default function ReferendaWhalesPage({ title, gov2ReferendaSummary }) {
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={gov2ReferendaSummary}
    >
      <WhalesContainer>
        <WhalesCurrentList />
      </WhalesContainer>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withReferendaCommonProps(async () => {
  const { result: whales } = await nextApi.fetch(gov2ReferendaWhalesApi);

  return {
    props: {
      whales,
    },
  };
});
