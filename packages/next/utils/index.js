import BigNumber from "bignumber.js";
import { nodes } from "next-common/utils/constants";

BigNumber.config({ EXPONENTIAL_AT: 36 });

export function textEllipsis(text, start, end) {
  if (!text) return;
  if (text.length <= start + end) return text;
  if (!text.slice) return text;
  return `${text.slice(0, start)}...${text.slice(-end)}`;
}

export function addressEllipsis(address, start = 4, end = 4) {
  return textEllipsis(address, start, end);
}

export function getNode(chain) {
  return nodes.find((n) => n.value === chain);
}

export function toPrecision(value, decimals) {
  return new BigNumber(value).dividedBy(Math.pow(10, decimals)).toString();
}

export function decimalPlaces(value, n) {
  return new BigNumber(value).dp(n).toString();
}

export function getTimelineStatus(type, method) {
  switch (type) {
    case "bounty":
      switch (method) {
        case "proposeBounty":
          return { value: "Propose Bounty" };
      }
      break;
    case "tip":
      switch (method) {
        case "reportAwesome":
          return { value: "Report Awesome" };
        case "TipRetracted":
          return { value: "Tip Retracted" };
        case "tip":
          return { value: "Tip" };
        case "TipClosed":
          return { value: "Tip Closed" };
      }
      break;
    case "proposal":
      switch (method) {
        case "clearPublicProposals":
          return { value: "Cleared" };
      }
  }
  return { value: method };
}
