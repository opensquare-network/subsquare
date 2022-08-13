import BigNumber from "bignumber.js";
import { detailPageCategory } from "next-common/utils/consts/business/category";

BigNumber.config({ EXPONENTIAL_AT: 36 });

export function getTimelineStatus(type, method) {
  switch (type) {
    case detailPageCategory.DEMOCRACY_PROPOSAL:
      switch (method) {
        case "FastTrack":
          return { value: "FastTracked", type };
      }
      break;
  }
  return { value: method, type };
}
