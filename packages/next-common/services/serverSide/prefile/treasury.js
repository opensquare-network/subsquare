import { backendApi } from "next-common/services/nextApi";
import { CHAIN } from "next-common/utils/constants";
import Chains from "next-common/utils/consts/chains";

export async function fetchProfileTreasuryProps(address) {
  if ([Chains.polkadot, Chains.kusama].includes(CHAIN)) {
    return {
      beneficiariesSummary: null,
    };
  }
  const { result } = await backendApi.fetch(
    `treasury/beneficiaries/${address}`,
  );
  return {
    beneficiariesSummary: result ?? null,
  };
}
