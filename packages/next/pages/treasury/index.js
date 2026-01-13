import { withCommonProps } from "next-common/lib";
import { TreasuryProvider } from "next-common/context/treasury";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import panelTabs from "next-common/components/treasury/status/panelTabs";
import TreasuryStatusContent from "next-common/components/treasury/status/treasuryStatusContent";

const seoInfo = {
  title: "Treasury Status",
  desc: "Provides an overview of treasury status",
};

export default function TreasuryStatusPage() {
  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={seoInfo.title}
        description={seoInfo.desc}
        tabs={panelTabs}
      >
        <TreasuryStatusContent />
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
