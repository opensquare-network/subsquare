import moment from "moment";

export function addressEllipsis(address, start = 4, end = 4) {
  if (!address) return;
  if (address.length <= start + end) return address;
  if (!address.slice) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function timeDuration(time) {
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
  let ss = now.diff(time, "seconds");
  let mm = now.diff(time, "minutes");
  let hh = now.diff(time, "hours");
  let dd = now.diff(time, "days");
  if (dd) {
    hh %= 24;
    if (hh) {
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
    // ss %= 60;
    // if (ss) {
    //   return `${mm} min${mm > 1 ? "s" : ""} ${ss} sec${ss > 1 ? "s" : ""} ago`;
    // }
    return `${mm} min${mm > 1 ? "s" : ""} ago`;
  }
  return `just now`;
}

export function encodeURIQuery(q) {
  Object.keys(q)
    .map((k) => `${k}=${encodeURIComponent(q[k])}`)
    .join("&");
}
