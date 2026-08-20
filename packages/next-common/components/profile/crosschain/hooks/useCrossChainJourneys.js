import { useAsync } from "react-use";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const OCELLOIDS_URL = "https://api.ocelloids.net/query/crosschain";
const OCELLOIDS_API_KEY = process.env.NEXT_PUBLIC_OCELLOIDS_API_KEY;
const PAGE_SIZE = 25;
const XCM_PROTOCOL = "xcm";
const EMPTY_PAGE_INFO = {
  hasNextPage: false,
  endCursor: null,
};

async function fetchXcmJourneys({ address, cursor = null }) {
  if (!OCELLOIDS_API_KEY) {
    return {
      items: [],
      pageInfo: EMPTY_PAGE_INFO,
    };
  }

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
    throw new Error(result?.message || "Unable to load XCM data");
  }

  return {
    items: result?.items || [],
    pageInfo: result?.pageInfo || EMPTY_PAGE_INFO,
  };
}

export default function useXcmJourneys(cursor = null) {
  const address = useProfileAddress();
  const { value, loading } = useAsync(async () => {
    if (!address) {
      return {
        items: [],
        pageInfo: EMPTY_PAGE_INFO,
      };
    }

    return fetchXcmJourneys({ address, cursor });
  }, [address, cursor]);

  return {
    isLoading: loading,
    items: value?.items ?? [],
    pageInfo: value?.pageInfo ?? EMPTY_PAGE_INFO,
  };
}
