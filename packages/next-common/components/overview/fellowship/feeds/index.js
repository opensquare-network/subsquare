import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import ScrollFeeds from "next-common/components/scrollFeeds";
import Link from "next/link";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import NoData from "next-common/components/noData";
import { useMemo } from "react";

export default function FellowshipFeeds() {
  const { value: feeds } = useAsync(async () => {
    const resp = await backendApi.fetch("/fellowship/feeds/recent");
    return resp.result || [];
  }, []);

  console.log("feeds", feeds);

  const hasFeeds = useMemo(() => feeds?.length > 0, [feeds]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <TitleContainer>Fellowship Feeds</TitleContainer>
        <Link
          href="/fellowship/feeds"
          className="text-theme500 text12Medium mr-6"
        >
          All Feeds
        </Link>
      </div>
      <SecondaryCard className="flex justify-center items-center flex-1">
        {hasFeeds ? (
          <ScrollFeeds feeds={feeds} />
        ) : (
          <NoData text="No activities in latest 30 days" />
        )}
      </SecondaryCard>
    </>
  );
}
