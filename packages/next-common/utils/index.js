import moment from "moment";
import BigNumber from "bignumber.js";
import { nodes } from "./constants";
import { bnToBn, extractTime } from "@polkadot/util";

BigNumber.config({ EXPONENTIAL_AT: 36 });

export function stringUpperFirst(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

export function textEllipsis(text, start, end) {
  if (!text) return;
  if (text.length <= start + end) return text;
  if (!text.slice) return text;
  return `${text.slice(0, start)}...${text.slice(-end)}`;
}

export function hexEllipsis(hex, start = 6, end = 4) {
  return textEllipsis(hex, start, end);
}

export function addressEllipsis(address, start = 4, end = 4) {
  return textEllipsis(address, start, end);
}

export function timeDuration(seconds) {
  if (!seconds) {
    return "Unknown time";
  }
  // return moment.duration(seconds * 1000);
  let duration = moment.duration(seconds, "seconds");
  return (
    duration
      .toString()
      .replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m ")
      .replace("S", "s ") + "remaining"
  );
}

export function timeDurationFromNow(time) {
  if (!time) {
    return "Unknown time";
  }
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ",
      s: (number) => number + " secs ago ",
      ss: "%d secs ago",
      m: "1 min ago",
      mm: "%d mins ago",
      h: "1 hour ago ",
      hh: "%d hours ago",
      d: "1 day ago",
      dd: "%dd ago",
      M: "1 month ago ",
      MM: "%d months ago ",
      y: "1 year ago",
      yy: "%d years ago",
    },
  });
  const now = moment();
  if (!now.isAfter(time)) {
    //todo 讨论当客户端时间不准时应当如何处理
    return moment(time).fromNow();
  }
  let mm = now.diff(time, "minutes");
  let hh = now.diff(time, "hours");
  let dd = now.diff(time, "days");
  if (dd) {
    hh %= 24;
    if (dd < 3 && hh) {
      return `${dd} day${dd > 1 ? "s" : ""} ${hh} hr${hh > 1 ? "s" : ""} ago`;
    }
    return `${dd} day${dd > 1 ? "s" : ""} ago`;
  }
  if (hh) {
    mm %= 60;
    if (mm) {
      return `${hh} hr${hh > 1 ? "s" : ""} ${mm} min${mm > 1 ? "s" : ""} ago`;
    }
    return `${hh} hr${hh > 1 ? "s" : ""} ago`;
  }
  if (mm) {
    return `${mm} min${mm > 1 ? "s" : ""} ago`;
  }
  return `just now`;
}

export function encodeURIQuery(q) {
  Object.keys(q)
    .map((k) => `${k}=${encodeURIComponent(q[k])}`)
    .join("&");
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
  const defaultColor = "#0F6FFF";
  switch (type) {
    case "proposal":
      switch (method) {
        case "FastTrack":
          return { value: "FastTracked", color: "#4CAF50" };
      }
      break;
    case "bounty":
      switch (method) {
        case "proposeBounty":
          return { value: "Propose Bounty", color: "#6848FF" };
      }
      break;
    case "tip":
      switch (method) {
        case "reportAwesome":
          return { value: "Report Awesome", color: "#6848FF" };
        case "TipRetracted":
          return { value: "Tip Retracted", color: defaultColor };
        case "tip":
          return { value: "Tip", color: defaultColor };
        case "TipClosed":
          return { value: "Tip Closed", color: defaultColor };
      }
  }
  return { value: method, color: defaultColor };
}

export const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export function bigNumber2Locale(x) {
  let result = "";
  const [Int, Decimals] = x.split(".");
  result += Int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (Decimals) {
    result += `.${Decimals}`;
  }
  return result;
}

export function matchMdLink(t) {
  const expression =
    /(?<!\]\()((?:https?|ftp):\/\/[^\s\]\)]*)(?:[\s\]\)](?!\()|$)/gi;
  return t.replace(expression, "[$1]($1) ");
}

export function abbreviateBigNumber(x, fixed = 2) {
  const n = new BigNumber(x);
  const fmt = {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
  };
  let divideBy = new BigNumber("1");
  const bigNumbers = [
    { bigNumber: new BigNumber("1000"), abbr: "K" },
    { bigNumber: new BigNumber("1000000"), abbr: "M" },
    { bigNumber: new BigNumber("1000000000"), abbr: "B" },
    { bigNumber: new BigNumber("1000000000000"), abbr: "T" },
    { bigNumber: new BigNumber("1000000000000000"), abbr: "Q" },
  ];
  bigNumbers.forEach((data) => {
    if (n.isGreaterThan(data.bigNumber)) {
      divideBy = data.bigNumber;
      fmt.suffix = data.abbr;
    }
  });
  BigNumber.config({ FORMAT: fmt });
  return new BigNumber(n.dividedBy(divideBy).toFixed(fixed)).toFormat();
}

export const estimateBlocksTime = (api, blocks, blockTime) => {
  if (api && blockTime) {
    const value = blockTime.mul(bnToBn(blocks)).toNumber();
    const time = extractTime(Math.abs(value));
    const { days, hours, minutes, seconds } = time;
    return [
      days ? (days > 1 ? `${days} days` : "1 day") : null,
      hours ? (hours > 1 ? `${hours} hrs` : "1 hr") : null,
      minutes ? (minutes > 1 ? `${minutes} mins` : "1 min") : null,
      seconds ? (seconds > 1 ? `${seconds} s` : "1 s") : null,
    ]
      .filter((s) => !!s)
      .slice(0, 2)
      .join(" ")
      .split(" ");
  }
};

export function isMotionEnded(motion) {
  return ["Closed", "Approved", "Executed", "Disapproved"].includes(
    motion?.state?.state
  );
}
