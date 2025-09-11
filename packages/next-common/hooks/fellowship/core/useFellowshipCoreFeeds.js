import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorCoreFeedsApiUri,
  fellowshipCoreFeedsApiUri,
} from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useAsync } from "react-use";

function useFeedsApi() {
  const { section } = useCollectivesContext();
  if (section === "fellowship") {
    return fellowshipCoreFeedsApiUri;
  } else if (section === "ambassador") {
    return ambassadorCoreFeedsApiUri;
  }
}

export default function useFellowshipCoreFeeds({ page, firstPageFeeds } = {}) {
  const { id: address } = usePageProps();
  const feedsApi = useFeedsApi();
  const { value = {}, loading } = useAsync(async () => {
    if (!feedsApi) {
      return;
    }

    if (page === 1 && firstPageFeeds) {
      return firstPageFeeds;
    }

    const resp = await backendApi.fetch(feedsApi, {
      who: address,
      page,
      pageSize: defaultPageSize,
    });

    return resp?.result;
  }, [page, address, feedsApi]);

  return {
    value,
    loading,
  };
}
