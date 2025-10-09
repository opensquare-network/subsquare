import { backendApi } from "next-common/services/nextApi";
import getChainSettings from "next-common/utils/consts/settings";

export async function fetchProfileTreasuryProps(address) {
  const { integrations } = getChainSettings(process.env.CHAIN);
  if (!integrations.doTreasury) {
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
