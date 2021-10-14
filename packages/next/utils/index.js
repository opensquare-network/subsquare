import moment from "moment";
import BigNumber from "bignumber.js";
import { nodes } from "./constants";

BigNumber.config({ EXPONENTIAL_AT: 36 });

export function addressEllipsis(address, start = 4, end = 4) {
  if (!address) return;
  if (address.length <= start + end) return address;
  if (!address.slice) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
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

export function getTimelineStatus(type, method) {
  const defaultColor = "#0F6FFF";
  switch (type) {
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
