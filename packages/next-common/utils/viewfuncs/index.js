import BigNumber from "bignumber.js";
import Chains from "../consts/chains";
import { BalanceDecimals } from "../constants";
import { detailPageCategory } from "../consts/business/category";

export function toApiType(type) {
  if (type === detailPageCategory.TREASURY_BOUNTY) {
    return "treasury/bounties";
  }
  if (type === detailPageCategory.TREASURY_CHILD_BOUNTY) {
    return "treasury/child-bounties";
  }
  if (type === detailPageCategory.FINANCIAL_MOTION) {
    return "financial-motions";
  }
  if (type === detailPageCategory.TECH_COMM_MOTION) {
    return "tech-comm/motions";
  }
  if (type === detailPageCategory.PA_POST) {
    return "polkassembly-discussions";
  }
  if (type === detailPageCategory.COUNCIL_MOTION) {
    return "motions";
  }
  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return "gov2/referendums";
  }
  if (type === detailPageCategory.FELLOWSHIP_REFERENDUM) {
    return "fellowship/referenda";
  }
  if (type === detailPageCategory.ADVISORY_MOTION) {
    return "advisory-motions";
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
  const value = new BigNumber(x);
  const fmt = {
    decimalSeparator: ".",
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
    if (value.isGreaterThan(data.bigNumber)) {
      divideBy = data.bigNumber;
      fmt.suffix = data.abbr;
    }
  });
  BigNumber.config({ FORMAT: fmt });
  return new BigNumber(value.dividedBy(divideBy).toFixed(fixed)).toFormat();
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
  return [46, 47, 48, 49].includes(address?.length) && isBase58(address);
};
