import ReferendaTracksSummary from "components/referenda/tracks/summary";
import TracksStatus from "components/referenda/tracks/tracksStatus";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { usePageProps } from "next-common/context/page";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";

function TracksPageLayout({ children }) {
  const { gov2ReferendaSummary } = usePageProps();
  return (
    <ReferendaLayout seoInfo={{ title: "" }} summaryData={gov2ReferendaSummary}>
      {children}
    </ReferendaLayout>
  );
}

export default function TracksPage() {
  return (
    <TracksPageLayout>
      <div className="ml-[24px] mb-[16px] text-textPrimary text20Bold">
        Track Status
      </div>
      <div className="flex flex-col gap-[24px]">
        <ReferendaTracksSummary />
        <TracksStatus />
      </div>
    </TracksPageLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();

  const { result: gov2ReferendaSummary } = await nextApi.fetch(
    gov2ReferendumsSummaryApi,
  );

  return {
    props: {
      ...tracksProps,
      gov2ReferendaSummary,
    },
  };
});
