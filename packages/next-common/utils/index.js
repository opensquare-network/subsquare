import BigNumber from "bignumber.js";
import { extractTime } from "@polkadot/util";
import { encodeAddress, isEthereumAddress } from "@polkadot/util-crypto";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { capitalize, isNil } from "lodash-es";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { isHex } from "@polkadot/util";
import { camelCase } from "lodash-es";
import { upperFirst } from "lodash-es";
import { getEffectiveNumbers } from "next-common/utils/viewfuncs";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

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

export function addressEllipsis(address, start, end) {
  if (typeof address !== "string") {
    return address;
  }

  if (isEthereumAddress(address)) {
    return textEllipsis(address, start || 6, end || 4);
  }

  return textEllipsis(address, start || 4, end || 4);
}

export function hashEllipsis(hash = "") {
  if (!hash) {
    return hash;
  }

  return hash.slice(0, 6);
}

export function timeDurationFromNow(time) {
  if (!time) {
    return "Unknown time";
  }

  dayjs.updateLocale("en", {
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

  const now = dayjs();
  if (dayjs(time).isSame(now) || dayjs(time).isAfter(now)) {
    return dayjs(time).fromNow();
  }

  let ss = now.diff(time, "second");
  let ii = now.diff(time, "minute");
  let hh = now.diff(time, "hour");
  let dd = now.diff(time, "day");
  let mm = now.diff(time, "month");
  let yy = now.diff(time, "year");

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

export function toPrecision(value, decimals = 0, fixed) {
  const normalized = BigNumber(value).dividedBy(Math.pow(10, decimals));
  if (isNil(fixed)) {
    return normalized.toString();
  } else {
    return normalized.toFixed(fixed);
  }
}

export function toPrecisionNumber(value, decimals = 0) {
  return new BigNumber(value).dividedBy(Math.pow(10, decimals)).toNumber();
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
    if (n.isGreaterThanOrEqualTo(data.bigNumber)) {
      divideBy = data.bigNumber;
      fmt.suffix = data.abbr;
    }
  });

  return new BigNumber(n.dividedBy(divideBy).toFixed(fixed)).toFormat(fmt);
}

export const estimateBlocksTime = (blocks, blockTime) => {
  if (!blockTime) {
    return null;
  }

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
};

export function isMotionEnded(motion) {
  return ["Closed", "Approved", "Executed", "Disapproved"].includes(
    motion?.state?.state,
  );
}

export function isPolkadotKeyRegisteredUser(user) {
  return user?.username?.startsWith("polkadot-key-0x");
}

export function isEthereumKeyRegisteredUser(user) {
  return user?.username?.startsWith("ethereum-key-0x");
}

export function isKeyRegisteredUser(user) {
  return isPolkadotKeyRegisteredUser(user) || isEthereumKeyRegisteredUser(user);
}

export function checkInputValue(
  inputValue,
  decimals,
  valueName = "value",
  allowZero = false,
) {
  if (!inputValue) {
    throw new Error(`Please input a valid ${valueName}`);
  }

  const bnValue = new BigNumber(inputValue).times(Math.pow(10, decimals));
  if (bnValue.isNaN()) {
    throw new Error(`Invalid ${valueName}`);
  }

  if (bnValue.lt(0)) {
    throw new Error(`${capitalize(valueName)} must not be less than 0`);
  }

  if (!allowZero && bnValue.isZero()) {
    throw new Error(`${capitalize(valueName)} must not be 0`);
  }

  if (!bnValue.mod(1).isZero()) {
    throw new Error("Invalid precision");
  }

  return bnValue;
}

export function isSameAddress(addr1, addr2) {
  if (!addr1 || !addr2) {
    return false;
  }

  if (addr1 === addr2) {
    return true;
  }

  if (isEthereumAddress(addr1) && isEthereumAddress(addr2)) {
    return addr1.toLowerCase() === addr2.toLowerCase();
  }

  try {
    return encodeAddress(addr1, 42) === encodeAddress(addr2, 42);
  } catch (e) {
    return false;
  }
}

export function isAddressInGroup(addr, addresses = []) {
  return addresses.some((item) => isSameAddress(addr, item));
}

export function isExternalLink(url = "") {
  return url.startsWith("http");
}

/**
 * @param {number} value unit is 1
 * @param decimals
 */
export function toPercentage(value = 0, decimals = 0) {
  const length = Math.pow(10, decimals);
  return Math.round(value * 100 * length) / length;
}

export function isHash(value) {
  return value && value.length === 66 && value.startsWith("0x");
}

export function isValidPreimageHash(hash) {
  return isHex(hash, 32 * 8);
}

export function upperFirstCamelCase(str) {
  return upperFirst(camelCase(str));
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNum(value) {
  let content = Number(value)?.toLocaleString();
  if (Number(value) >= 100000 || getEffectiveNumbers(value)?.length >= 11) {
    const abbreviated = abbreviateBigNumber(value, 2);
    content = abbreviated;
    if (getEffectiveNumbers(abbreviated) !== getEffectiveNumbers(value)) {
      content = "≈" + content;
    }
  } else if (String(value).includes(".")) {
    const [int, decimal] = String(value).split(".");
    if (decimal?.length > 5) {
      const shortDecimal = decimal.substring(0, 5);
      content = "≈" + int + "." + shortDecimal;
    }
  }
  return content;
}
