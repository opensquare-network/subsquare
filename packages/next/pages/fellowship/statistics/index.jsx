import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipCollectivesStatistics from "next-common/components/fellowship/statistics/collectives";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function FellowshipStatisticsPage() {
  const category = "Fellowship Statistics";
  const seoInfo = { title: category, desc: category };

  return (
    <CollectivesProvider section="fellowship">
      <ListLayout seoInfo={seoInfo} title={category}>
        <FellowshipCollectivesStatistics />
      </ListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
