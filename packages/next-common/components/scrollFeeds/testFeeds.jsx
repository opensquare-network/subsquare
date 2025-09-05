import { fellowshipCoreFeedsApiUri } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { SecondaryCard } from "../styled/containers/secondaryCard";
import { TitleContainer } from "../styled/containers/titleContainer";
import ScrollFeeds from "./index";
import Link from "next/link";

export default function TestFeeds() {
  const { value } = useAsync(async () => {
    const resp = await backendApi.fetch(fellowshipCoreFeedsApiUri);
    return resp.result?.items || [];
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <TitleContainer>
          Fellowship Feeds{" "}
          <span className="text-textTertiary text14Medium ml-1">
            {value?.length}
          </span>
        </TitleContainer>
        <Link href="/fellowship/feeds" className="text-theme500 text12Medium">
          All Feeds
        </Link>
      </div>
      <SecondaryCard>
        <ScrollFeeds feeds={value} />
      </SecondaryCard>
    </>
  );
}
