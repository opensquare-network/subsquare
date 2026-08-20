import { useAsync } from "react-use";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const OCELLOIDS_URL = "https://api.ocelloids.net/query/crosschain";
const OCELLOIDS_API_KEY =
  "eyJhbGciOiJFZERTQSIsImtpZCI6Im92SFVDU3hRM0NiYkJmc01STVh1aVdjQkNZcDVydmpvamphT2J4dUxxRDQ9In0.ewogICJpc3MiOiAiYXBpLm9jZWxsb2lkcy5uZXQiLAogICJqdGkiOiAiMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLAogICJzdWIiOiAicHVibGljQG9jZWxsb2lkcyIKfQo.qKSfxo6QYGxzv40Ox7ec6kpt2aVywKmhpg6lue4jqmZyY6y3SwfT-DyX6Niv-ine5k23E0RKGQdm_MbtyPp9CA";
const PAGE_SIZE = 25;
const XCM_PROTOCOL = "xcm";
const EMPTY_PAGE_INFO = {
  hasNextPage: false,
  endCursor: null,
};

async function fetchCrossChainJourneys({ address, cursor = null }) {
  const response = await fetch(OCELLOIDS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OCELLOIDS_API_KEY}`,
    },
    body: JSON.stringify({
      pagination: {
        limit: PAGE_SIZE,
        ...(cursor ? { cursor } : {}),
      },
      args: {
        op: "journeys.list",
        criteria: {
          address,
          protocols: [XCM_PROTOCOL],
        },
      },
    }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Unable to load cross-chain data");
  }

  return {
    items: result?.items || [],
    pageInfo: result?.pageInfo || EMPTY_PAGE_INFO,
  };
}

export default function useCrossChainJourneys(cursor = null) {
  const address = useProfileAddress();
  const { value, loading } = useAsync(async () => {
    if (!address) {
      return {
        items: [],
        pageInfo: EMPTY_PAGE_INFO,
      };
    }

    return fetchCrossChainJourneys({ address, cursor });
  }, [address, cursor]);

  return {
    isLoading: loading,
    items: value?.items ?? [],
    pageInfo: value?.pageInfo ?? EMPTY_PAGE_INFO,
  };
}
