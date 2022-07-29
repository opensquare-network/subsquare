import BigNumber from "bignumber.js";
import { detailPageCategory } from "next-common/utils/consts/business/category";

BigNumber.config({ EXPONENTIAL_AT: 36 });

export function decimalPlaces(value, n) {
  return new BigNumber(value).dp(n).toString();
}

export function getTimelineStatus(type, method) {
  switch (type) {
    case detailPageCategory.TREASURY_BOUNTY:
      switch (method) {
        case "proposeBounty":
          return { value: "Propose Bounty", type };
      }
      break;
    case detailPageCategory.TREASURY_TIP:
      switch (method) {
        case "reportAwesome":
          return { value: "Report Awesome", type };
        case "TipRetracted":
          return { value: "Tip Retracted", type };
        case "tip":
          return { value: "Tip", type };
        case "TipClosed":
          return { value: "Tip Closed", type };
      }
      break;
    case detailPageCategory.DEMOCRACY_PROPOSAL:
      switch (method) {
        case "clearPublicProposals":
          return { value: "Cleared", type };
      }
  }

  return { value: method, type };
}
