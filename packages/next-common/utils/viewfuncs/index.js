import BigNumber from "bignumber.js";
import Chains from "../consts/chains";
import { BalanceDecimals } from "../constants";

export function toApiType(type) {
  if (type === "treasury/bounty") {
    return "treasury/bounties";
  }
  if (type === "treasury/child-bounty") {
    return "treasury/child-bounties";
  }
  return `${type}s`;
}

export function getEffectiveNumbers(n) {
  const result = [];
  let flag = false;
  n.toString()
    .split("")
    .reverse()
    .forEach((dig) => {
      if (!isNaN(parseInt(dig))) {
        flag = flag || parseInt(dig) > 0;
        flag && result.push(dig);
      }
    });
  return result.reverse().join();
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

export const getExcludeChains = (includeChains) => {
  return Object.values(Chains).filter(
    (chain) => !includeChains.includes(chain)
  );
};

export const formatBalance = (x, symbol) => {
  return new BigNumber(x).toFixed(
    BalanceDecimals[symbol] ?? 2,
    BigNumber.ROUND_DOWN
  );
};

//fixme: this a for mention insert from replay button
//find a elegant way to do this
export const prettyHTML = (html) => {
  return html
    .replaceAll(`data-osn-polka-network`, `osn-polka-network`)
    .replaceAll(`data-osn-polka-address`, `osn-polka-address`);
};

const isBase58 = (value) => /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);

export const isAddress = (address) => {
  return [46, 47, 48].includes(address?.length) && isBase58(address);
};

export const renderDisableNonAddressLink = (el) => {
  const targets = el?.querySelectorAll?.(`a`);
  targets?.forEach((target) => {
    const [, memberId] =
      target.getAttribute("href")?.match(/^\/member\/([-\w]+)$/) || [];
    if (memberId && !isAddress(memberId)) {
      target.classList.add("disabled-link");
    } else {
      target.setAttribute("target", "_blank");
    }
  });

  el?.querySelectorAll("span.mention").forEach((block) => {
    const p = block.parentElement;
    const address = block.getAttribute("osn-polka-address");
    if (isAddress(address)) {
      p.innerHTML = `<a href="/member/${address}" target="_blank">${block.innerText}</a>`;
    }
  });
};

export function richTextCopy(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}
