import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipCollectivesStatistics from "next-common/components/fellowship/statistics/collectives";
import nextApi from "next-common/services/nextApi";

export default function FellowshipStatisticsPage() {
  const category = "Fellowship Statistics";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout seoInfo={seoInfo} title={category}>
      <FellowshipCollectivesStatistics />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [tracksProps, { result: membersSummary }] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch("fellowship/members/summary"),
  ]);

  return {
    props: {
      ...tracksProps,
      membersSummary: membersSummary || {},
    },
  };
});
