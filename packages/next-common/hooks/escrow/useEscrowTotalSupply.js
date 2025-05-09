import { useEffect, useState } from "react";
import useChainOrScanHeight from "next-common/hooks/height";
import { useContextApi } from "next-common/context/api";
import { getTotalSupply } from "next-common/utils/democracy/kintsugi/escrow/totalSupply";
import { isNil } from "lodash-es";

export default function useEscrowTotalSupply() {
  const height = useChainOrScanHeight();
  const api = useContextApi();
  const [supply, setSupply] = useState(null);

  useEffect(() => {
    if (!api || isNil(height)) {
      return;
    }

    getTotalSupply(api, height).then((result) => setSupply(result));
  }, [api, height]);

  return supply;
}
