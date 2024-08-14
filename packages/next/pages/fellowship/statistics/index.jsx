import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipCollectivesStatistics from "next-common/components/fellowship/statistics/collectives";
import useFetchFellowshipMembers from "next-common/hooks/fellowship/collective/useFetchFellowshipMembers";

export default function FellowshipStatisticsPage() {
  useFetchFellowshipMembers();
  const category = "Fellowship Statistics";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout seoInfo={seoInfo} title={category}>
      <FellowshipCollectivesStatistics />
    </ListLayout>
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
