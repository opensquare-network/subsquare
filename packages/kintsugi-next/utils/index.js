import BigNumber from "bignumber.js";
import { detailPageCategory } from "next-common/utils/consts/business/category";

BigNumber.config({ EXPONENTIAL_AT: 36 });

export function getTimelineStatus(type, method, args) {
  switch (type) {
    case detailPageCategory.DEMOCRACY_PROPOSAL:
      switch (method) {
        case "FastTrack":
          return { value: "FastTracked", type };
      }
      break;
    case detailPageCategory.DEMOCRACY_REFERENDUM:
      switch (method) {
        case "Executed":
          return {
            value: method,
            type,
            args: { isOk: Object.keys(args.result).includes("ok") },
          };
      }
  }
  return { value: method, type };
}
