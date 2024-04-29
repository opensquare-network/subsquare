import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useContextApi } from "next-common/context/api";
import { getTotalSupply } from "next-common/utils/democracy/kintsugi/escrow/totalSupply";
import { isNil } from "lodash-es";

export default function useEscrowTotalSupply() {
  const height = useSelector(chainOrScanHeightSelector);
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
