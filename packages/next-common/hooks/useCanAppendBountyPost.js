import {
  useCurator,
  useCuratorParams,
} from "next-common/context/treasury/bounties";
import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useCanAppendBountyPost() {
  const address = useRealAddress();
  const curator = useCurator();
  const { signatories } = useCuratorParams();

  const isCurator = useMemo(() => {
    return isSameAddress(address, curator);
  }, [address, curator]);

  const isSignatoryOfCurator = useMemo(() => {
    if (!signatories || signatories?.length === 0) {
      return false;
    }

    return signatories?.includes(address);
  }, [address, signatories]);

  return useMemo(() => {
    if (!address) {
      return false;
    }

    return isCurator || isSignatoryOfCurator;
  }, [isCurator, isSignatoryOfCurator, address]);
}
