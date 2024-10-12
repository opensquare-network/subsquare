import { useEffect, useState } from "react";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import { useContextApi } from "next-common/context/api";
import { getTotalSupply } from "next-common/utils/democracy/kintsugi/escrow/totalSupply";
import { isNil } from "lodash-es";

export default function useEscrowTotalSupply() {
  const height = useBlockHeight();
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
