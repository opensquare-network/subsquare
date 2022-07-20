import moment from "moment";
import BigNumber from "bignumber.js";
import { nodes } from "./constants";
import { extractTime } from "@polkadot/util";

BigNumber.config({ EXPONENTIAL_AT: 36 });

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
      s: (number) => number + " secs",
      ss: "%d secs",
      m: "1 min",
      mm: "%d mins",
      h: "1 h",
      hh: "%d hrs",
      d: "1 d",
      dd: "%dd",
      M: "1 mo",
      MM: "%d mos",
      y: "1 y",
      yy: "%d y",
    },
  });
  const now = moment();
  if (moment(time).isSameOrAfter(now)) {
    return moment(time).fromNow();
  }

  let ss = now.diff(time, "seconds");
  let ii = now.diff(time, "minutes");
  let hh = now.diff(time, "hours");
  let dd = now.diff(time, "days");
  let mm = now.diff(time, "months");
  let yy = now.diff(time, "years");
  if (yy) {
    mm %= 12;
    if (mm) {
      return `${yy}y ${mm}mo${mm > 1 ? "s" : ""} ago`;
    }
    return `${yy}y ago`;
  }
  if (mm) {
    return `${mm}mo${mm > 1 ? "s" : ""} ago`;
  }
  if (dd) {
    hh %= 24;
    if (hh && dd < 3) {
      return `${dd}d ${hh}h${hh > 1 ? "rs" : ""} ago`;
    }
    return `${dd}d ago`;
  }
  if (hh) {
    ii %= 60;
    if (ii) {
      return `${hh}h${hh > 1 ? "rs" : ""} ${ii}min${ii > 1 ? "s" : ""} ago`;
    }
    return `${hh}h${hh > 1 ? "rs" : ""} ago`;
  }
  if (ii) {
    ss %= 60;
    if (ss) {
      return `${ii}min${ii > 1 ? "s" : ""} ${ss}s ago`;
    }
    return `${ii}min${ii > 1 ? "s" : ""} ago`;
  }
  return `${ss}s ago`;
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

export const estimateBlocksTime = (blocks, blockTime) => {
  if (blockTime) {
    const value = new BigNumber(blockTime).multipliedBy(blocks).toNumber();
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

export function isKeyRegisteredUser(user) {
  return !!user.publicKey;
}

export function emptyFunction() {}

export const capitailize = (text) => text[0].toUpperCase() + text.slice(1);

export function checkInputValue(inputValue, decimals, valueName = "value") {
  if (!inputValue) {
    throw new Error(`Please input a ${valueName}`);
  }

  const bnValue = new BigNumber(inputValue).times(Math.pow(10, decimals));
  // if (bnValue.isNaN()) {
  //   throw new Error(`Invalid ${valueName}`);
  // }

  // if (bnValue.lte(0)) {
  //   throw new Error(`${capitailize(valueName)} must be greater than 0`);
  // }

  // if (!bnValue.mod(1).isZero()) {
  //   throw new Error("Invalid precision");
  // }

  return bnValue;
}
