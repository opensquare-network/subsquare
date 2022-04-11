import moment from "moment";
import BigNumber from "bignumber.js";
import { nodes } from "next-common/utils/constants";

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
  }
  return { value: method };
}

export function isMotionEnded(motion) {
  return ["Closed", "Approved", "Executed", "Disapproved"].includes(
    motion.state.state
  );
}
