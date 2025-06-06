import { EmptyList } from "next-common/utils/constants";
import { backendApi } from "next-common/services/nextApi";
import {
  getFellowshipReferendumUrl,
  gov2ReferendumsDetailApi,
} from "next-common/services/url";

const referenda = "referenda";
const fellowshipReferenda = "fellowshipReferenda";
const democracy = "democracy";
const treasuryProposal = "treasuryProposal";

export async function fetchAndPopulateDetail(
  deposits = [],
  pallet = referenda,
) {
  if (
    ![referenda, fellowshipReferenda, democracy, treasuryProposal].includes(
      pallet,
    )
  ) {
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
    } else if (democracy === pallet) {
      url = `democracy/proposals/${deposit.proposalIndex}`;
    } else if (treasuryProposal === pallet) {
      url = `treasury/proposals/${deposit.proposalIndex}`;
    }
    return backendApi.fetch(url);
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
