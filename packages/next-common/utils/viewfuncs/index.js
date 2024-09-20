import BigNumber from "bignumber.js";
import Chains from "../consts/chains";
import { BalanceDecimals } from "../constants";
import { detailPageCategory } from "../consts/business/category";
import { getMotionId } from "next-common/utils/motion";
import { getTitle } from "next-common/utils/post";
import {
  advisoryCommitteeBaseUrl,
  childBountyBaseUrl,
  communityMotionBaseUrl,
} from "next-common/utils/postBaseUrl";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";
import { isAddress } from "@polkadot/util-crypto";

export function toApiType(type) {
  // Open Gov
  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return "gov2/referendums";
  } else if (type === detailPageCategory.FELLOWSHIP_REFERENDUM) {
    return "fellowship/referenda";
  } else if (type === detailPageCategory.AMBASSADOR_REFERENDUM) {
    return "ambassador/referenda";
  }

  // Democracy
  if (type === detailPageCategory.DEMOCRACY_REFERENDUM) {
    return "democracy/referendums";
  }
  if (type === detailPageCategory.DEMOCRACY_PROPOSAL) {
    return "democracy/proposals";
  }
  if (type === detailPageCategory.DEMOCRACY_EXTERNAL) {
    return "democracy/externals";
  }

  // Treasury
  if (type === detailPageCategory.TREASURY_BOUNTY) {
    return "treasury/bounties";
  } else if (type === detailPageCategory.TREASURY_CHILD_BOUNTY) {
    return "treasury/child-bounties";
  } else if (type === detailPageCategory.TREASURY_PROPOSAL) {
    return "treasury/proposals";
  } else if (type === detailPageCategory.TREASURY_TIP) {
    return "treasury/tips";
  } else if (type === detailPageCategory.TREASURY_SPEND) {
    return "treasury/spends";
  }

  // Motions
  if (type === detailPageCategory.COUNCIL_MOTION) {
    return "motions";
  }
  if (type === detailPageCategory.TECH_COMM_MOTION) {
    return "tech-comm/motions";
  }

  // Polkassembly
  if (type === detailPageCategory.PA_POST) {
    return "polkassembly-discussions";
  }

  // Collectives
  if (type === detailPageCategory.ALLIANCE_MOTION) {
    return "alliance/motions";
  }
  if (type === detailPageCategory.ALLIANCE_ANNOUNCEMENT) {
    return "alliance/announcements";
  }

  // Karura
  if (type === detailPageCategory.FINANCIAL_MOTION) {
    return "financial-motions";
  }

  // Zeitgeist
  if (type === detailPageCategory.ADVISORY_MOTION) {
    return "advisory-motions";
  }

  return type;
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
    if (value.isGreaterThanOrEqualTo(data.bigNumber)) {
      divideBy = data.bigNumber;
      fmt.suffix = data.abbr;
    }
  });
  BigNumber.config({ FORMAT: fmt });
  return new BigNumber(value.dividedBy(divideBy).toFixed(fixed)).toFormat();
}

export const getExcludeChains = (includeChains) => {
  return Object.values(Chains).filter(
    (chain) => !includeChains.includes(chain),
  );
};

export const formatBalance = (x, symbol) => {
  return new BigNumber(x).toFixed(
    BalanceDecimals[symbol] ?? 2,
    BigNumber.ROUND_DOWN,
  );
};

//fixme: this a for mention insert from replay button
//find a elegant way to do this
export const prettyHTML = (html) => {
  return html
    .replaceAll("data-osn-polka-network", "osn-polka-network")
    .replaceAll("data-osn-polka-address", "osn-polka-address");
};

const isBase58 = (value) => /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);

export const isPolkadotAddress = (address) => {
  return (
    isAddress(address) &&
    [46, 47, 48, 49].includes(address?.length) &&
    isBase58(address)
  );
};

export const toFinancialMotionsListItem = (item) => {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    author: item.author,
    address: item.proposer,
    status: item.state ?? "Unknown",
    detailLink: `/financial-council/motions/${getMotionId(item)}`,
    time: getPostLastActivityAt(item),
  };
};

export const toAdvisoryMotionsListItem = (item) => ({
  ...item,
  index: item.motionIndex,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  detailLink: `${advisoryCommitteeBaseUrl}/${getMotionId(item)}`,
  time: getPostLastActivityAt(item),
});

export const toCommunityMotionsListItem = (item) => ({
  ...item,
  index: item.motionIndex,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  detailLink: `${communityMotionBaseUrl}/${getMotionId(item)}`,
  time: getPostLastActivityAt(item),
});

export const toTreasuryChildBountyListItem = (item) => ({
  ...item,
  title: getTitle(item),
  author: item.author,
  address: item.proposer,
  status: item.state ?? "Unknown",
  time: getPostLastActivityAt(item),
  value: item.onchainData.value,
  detailLink: `${childBountyBaseUrl}/${item.index}`,
  parentIndex: item.parentBountyId,
});

export function formatVerySmallNumberWithAbbr(value) {
  const bigValue = new BigNumber(value);

  const smallNumbers = [
    { smallNumber: new BigNumber("0.001"), abbr: "m" }, // milli (10^-3)
    { smallNumber: new BigNumber("0.000001"), abbr: "μ" }, // micro (10^-6)
    { smallNumber: new BigNumber("0.000000001"), abbr: "n" }, // nano (10^-9)
    { smallNumber: new BigNumber("0.000000000001"), abbr: "p" }, // pico (10^-12)
    { smallNumber: new BigNumber("0.000000000000001"), abbr: "f" }, // femto (10^-15)
    { smallNumber: new BigNumber("0.000000000000000001"), abbr: "a" }, // atto (10^-18)
  ];

  if (bigValue.isGreaterThanOrEqualTo(1)) {
    return bigValue.toFixed(2);
  }

  for (let i = 0; i < smallNumbers.length; i++) {
    const { smallNumber, abbr } = smallNumbers[i];

    if (bigValue.isGreaterThanOrEqualTo(smallNumber)) {
      const divided = bigValue.dividedBy(smallNumber).toFixed(2);
      return `${divided}${abbr}`;
    }
  }

  return bigValue.toFixed(2);
}
