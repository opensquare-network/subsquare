import ReferendaTracksSummary from "components/referenda/tracks/summary";
import BaseLayout from "next-common/components/layout/baseLayout";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { cn } from "next-common/utils";

function TracksPageLayout({ children }) {
  return (
    <BaseLayout seoInfo={{ title: "" }}>
      <div className="flex-1">
        <div className={cn("px-6 py-6 mx-auto max-w-[1200px]", "max-sm:px-0")}>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}

export default function TracksPage() {
  return (
    <TracksPageLayout>
      <div className="ml-[24px] mb-[16px] text-textPrimary text20Bold">
        Track Status
      </div>
      <ReferendaTracksSummary />
    </TracksPageLayout>
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
