import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";

export default function useAssetHubTransfersHistory(page = 0, page_size = 25) {
  const { value: value, loading } = useAsync(async () => {
    const url = `https://statemint-api.statescan.io/accounts/15PWs66SguKkvRXBdxSoSWbicXfxQQ9qiSxiU6GNzJDfzqA7/transfers`;

    const response = await nextApi.fetch(url, {
      page,
      page_size,
    });

    return response?.result;
  }, [page, page_size]);

  return { value, loading };
}
