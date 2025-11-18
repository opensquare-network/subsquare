import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipCollectivesStatistics from "next-common/components/fellowship/statistics/collectives";
import CollectivesProvider from "next-common/context/collectives/collectives";
import {
  ambassadorMembersApiUri,
  fellowshipMembersApiUri,
} from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";

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
  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: ambassadorMembers },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch(fellowshipMembersApiUri),
    backendApi.fetch(ambassadorMembersApiUri),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers: fellowshipMembers ?? null,
      ambassadorMembers: ambassadorMembers ?? null,
    },
  };
});
