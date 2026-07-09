import { createContext, useContext } from "react";
import { backendApi } from "next-common/services/nextApi";
import normalizeChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import normalizeMultiAssetChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeMultiAssetChildBountyListItem";

export async function fetchBountyChildBounties(data, parentBountyId) {
  if (!data?.childBounties?.length) {
    return [];
  }
  const { result } = await backendApi.fetch(
    "treasury/child-bounties?simple=true&" +
      data.childBounties
        .map(
          (item) =>
            "ids=" + `${parentBountyId}_${item.index}_${item.blockHeight}`,
        )
        .join("&"),
  );
  if (!result) {
    return [];
  }
  return result.map((item) => {
    const payout =
      data?.childBounties?.find((payout) => payout.index === item.index) || {};
    const normalizedChildBounty = normalizeChildBountyListItem(
      process.env.NEXT_PUBLIC_CHAIN,
      item,
    );
    return {
      ...normalizedChildBounty,
      ...payout,
    };
  });
}

export async function fetchMultiAssetChildBounties(data, parentBountyId) {
  if (!data?.childBounties?.length) {
    return [];
  }
  const { result } = await backendApi.fetch(
    "treasury/multi-asset-child-bounties?simple=true&" +
      data.childBounties
        .map(
          (item) =>
            "ids=" + `${parentBountyId}_${item.index}_${item.blockHeight}`,
        )
        .join("&"),
  );
  if (!result) {
    return [];
  }
  return result.map((item) => {
    const payout =
      data?.childBounties?.find((payout) => payout.index === item.index) || {};
    const normalizedChildBounty = normalizeMultiAssetChildBountyListItem(
      process.env.NEXT_PUBLIC_CHAIN,
      item,
    );
    return {
      ...normalizedChildBounty,
      ...payout,
    };
  });
}

const ChildBountiesContext = createContext(fetchBountyChildBounties);

export function useChildBountiesFetcher() {
  return useContext(ChildBountiesContext);
}

export default ChildBountiesContext;
