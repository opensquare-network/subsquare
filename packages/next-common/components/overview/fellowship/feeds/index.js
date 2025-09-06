import { fellowshipCoreFeedsApiUri } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import ScrollFeeds from "next-common/components/scrollFeeds";
import Link from "next/link";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function FellowshipFeeds() {
  const { value } = useAsync(async () => {
    const resp = await backendApi.fetch(fellowshipCoreFeedsApiUri);
    return resp.result?.items || [];
  }, []);

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
      <SecondaryCard>
        <ScrollFeeds feeds={value} />
      </SecondaryCard>
    </>
  );
}
