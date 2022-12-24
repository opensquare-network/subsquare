import { useTally } from "../../../context/post/gov2/referendum";
import { useDetailType } from "../../../context/page";
import { detailPageCategory } from "../../consts/business/category";
import useReferendaIssuance from "./useReferendaIssuance";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

// support/issuance perbill value
export default function useSupportPerbill() {
  const tally = useTally();
  const issuance = useReferendaIssuance();
  const pageType = useDetailType();
  const [perbill, setPerbill] = useState();

  useEffect(() => {
    if (!issuance) {
      return;
    }

    let support;
    if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
      support = tally?.bareAyes;
    } else if (detailPageCategory.GOV2_REFERENDUM === pageType) {
      support = tally?.support;
    }

    const perbill = new BigNumber(support)
      .div(issuance)
      .multipliedBy(Math.pow(10, 9))
      .toNumber();
    setPerbill(perbill);
  }, [tally, pageType, issuance]);

  return perbill;
}
