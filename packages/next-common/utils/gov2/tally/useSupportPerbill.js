import { useDetailType } from "../../../context/page";
import { useEffect, useState } from "react";
import useReferendaIssuance from "../../../hooks/referenda/useReferendaIssuance";
import calcPerbill from "../../math/calcPerbill";

// support/issuance perbill value
export default function useSupportPerbill(tally) {
  const issuance = useReferendaIssuance();
  const pageType = useDetailType();
  const [perbill, setPerbill] = useState(calcPerbill(tally?.support, issuance));

  useEffect(() => {
    setPerbill(calcPerbill(tally?.support, issuance));
  }, [tally, pageType, issuance]);

  return perbill;
}
