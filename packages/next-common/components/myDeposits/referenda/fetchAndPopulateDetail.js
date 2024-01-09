import { EmptyList } from "next-common/utils/constants";
import nextApi from "next-common/services/nextApi";
import {
  getFellowshipReferendumUrl,
  gov2ReferendumsDetailApi,
} from "next-common/services/url";

const referenda = "referenda";
const fellowshipReferenda = "fellowshipReferenda";

export async function fetchAndPopulateDetail(
  deposits = [],
  pallet = referenda,
) {
  if (![referenda, fellowshipReferenda].includes(pallet)) {
    throw new Error(
      `Unknown pallet: ${pallet} when fetch and populate detail info`,
    );
  }

  if (deposits.length <= 0) {
    return { result: EmptyList };
  }

  const fetchers = deposits.map((deposit) => {
    let url = gov2ReferendumsDetailApi(deposit.referendumIndex);
    if (fellowshipReferenda === pallet) {
      url = getFellowshipReferendumUrl(deposit.referendumIndex);
    }
    return nextApi.fetch(url);
  });
  const resps = await Promise.all(fetchers);
  const items = resps.map((resp, idx) => {
    return {
      ...resp.result,
      ...deposits[idx],
    };
  });

  return {
    result: {
      items,
      total: deposits.length,
    },
  };
}
