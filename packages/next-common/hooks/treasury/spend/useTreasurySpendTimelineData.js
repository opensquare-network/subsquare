import { useMemo } from "react";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { detailPageCategory } from "next-common/utils/consts/business/category";

function getTimelineData(method, args) {
  if ("Paid" === method) {
    return { "Payment Id": args.paymentId };
  }

  return args;
}

function getStatus(method) {
  const value = "AssetSpendApproved" === method ? "Approved" : method;
  return { value, type: detailPageCategory.TREASURY_SPEND };
}

export default function useTreasurySpendTimelineData(spend) {
  return useMemo(() => {
    return (spend.timeline || []).map((item) => {
      const indexer = item.indexer;
      const value = item.method ?? item.name;

      return {
        indexer,
        time: formatTime(indexer?.blockTime),
        status: getStatus(value),
        data: getTimelineData(value, item.args),
      };
    });
  }, [spend]);
}
