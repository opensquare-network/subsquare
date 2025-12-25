import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import ScrollFeeds from "next-common/components/scrollFeeds";
import Link from "next-common/components/link";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import NoData from "next-common/components/noData";
import { useMemo } from "react";
import CollectivesProvider from "next-common/context/collectives/collectives";
import Loading from "next-common/components/loading";

export default function FellowshipFeeds() {
  const { value: feeds, loading } = useAsync(async () => {
    const resp = await backendApi.fetch("/fellowship/feeds/recent");
    return resp.result || [];
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <TitleContainer>Latest Feeds</TitleContainer>
        <Link
          href="/fellowship/feeds"
          className="text-theme500 text12Medium mr-6"
        >
          All Feeds
        </Link>
      </div>
      <SecondaryCard className="flex justify-center items-center flex-1">
        <FellowshipFeedsImpl feeds={feeds} loading={loading} />
      </SecondaryCard>
    </>
  );
}

function FellowshipFeedsImpl({ feeds, loading }) {
  const isEmpty = useMemo(() => feeds?.length <= 0, [feeds]);

  if (loading) {
    return <Loading size={24} />;
  }

  if (isEmpty) {
    return <NoData text="No activities in latest 30 days" />;
  }

  return (
    <CollectivesProvider section="fellowship">
      <ScrollFeeds feeds={feeds} />
    </CollectivesProvider>
  );
}
