import { useMemo } from "react";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import useCoretimeStatus from "next-common/context/coretime/status";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { isSameAddress } from "next-common/utils";

export default function useRegionActionState({ begin, core, mask }, action) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const status = useCoretimeStatus();
  const regionId = useMemo(() => ({ begin, core, mask }), [begin, core, mask]);
  const { result, loading } = useSubStorage("broker", "regions", [regionId]);
  const region = result?.toJSON();
  const isScheduling = action === "assign" || action === "pool";
  const lastCommittedTimeslice = status?.lastCommittedTimeslice;

  let error;
  if (!api || loading || (isScheduling && isNil(lastCommittedTimeslice))) {
    error = "Waiting for Coretime data";
  } else if (!region) {
    error = "This region is no longer available";
  } else if (!isSameAddress(region.owner, signerAccount?.realAddress)) {
    error = "Only the region owner can perform this action";
  } else if (isScheduling && region.end <= lastCommittedTimeslice + 1) {
    error = `This region has no uncommitted coretime to ${action}`;
  }

  return { api, regionId, error };
}
