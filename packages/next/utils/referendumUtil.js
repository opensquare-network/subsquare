import BigNumber from "bignumber.js";

const ONE = new BigNumber(1);

export function getThresholdOfSimplyMajority() {
  return "50%";
}

export function getThresholdOfSuperMajorityAgainst(turnout, totalIssuance) {
  const sqrtElectorate = new BigNumber(totalIssuance).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();

  if (sqrtOfTurnout.isZero() || sqrtElectorate.isZero()) {
    return "0%";
  }

  const bnAyes = ONE.times(sqrtOfTurnout).div(sqrtElectorate);
  const threshold = bnAyes.div(bnAyes.plus(ONE)).times(100).toFixed(0);

  return `${threshold}%`;
}

export function getThresholdOfSuperMajorityApprove(turnout, totalIssuance) {
  const sqrtElectorate = new BigNumber(totalIssuance).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();

  if (sqrtOfTurnout.isZero() || sqrtElectorate.isZero()) {
    return "0%";
  }

  const bnAyes = ONE.times(sqrtElectorate).div(sqrtOfTurnout);
  const threshold = bnAyes.div(bnAyes.plus(ONE)).times(100).toFixed(0);

  return `${threshold}%`;
}

function compareRationals(n1, d1, n2, d2) {
  while (true) {
    const q1 = n1.div(d1);
    const q2 = n2.div(d2);

    if (q1.lt(q2)) {
      return true;
    } else if (q2.lt(q1)) {
      return false;
    }

    const r1 = n1.mod(d1);
    const r2 = n2.mod(d2);

    if (r2.isZero()) {
      return false;
    } else if (r1.isZero()) {
      return true;
    }

    n1 = d2;
    n2 = d1;
    d1 = r2;
    d2 = r1;
  }
}

export function calcPassing(referendumInfo, totalIssuance) {
  if (!referendumInfo) {
    return false;
  }

  const ayes = new BigNumber(referendumInfo.tally.ayes);
  const nays = new BigNumber(referendumInfo.tally.nays);
  const threshold = referendumInfo.threshold;

  if (threshold.toLowerCase() === "simplemajority") {
    return ayes.gt(nays);
  }

  const turnout = new BigNumber(referendumInfo.tally.turnout);
  const sqrtTurnout = turnout.sqrt();
  const sqrtElectorate = new BigNumber(totalIssuance).sqrt();

  if (sqrtTurnout.isZero()) {
    return false;
  }

  if (threshold.toLowerCase() === "supermajorityapprove") {
    return compareRationals(nays, sqrtTurnout, ayes, sqrtElectorate);
  } else if (threshold.toLowerCase() === "supermajorityagainst") {
    return compareRationals(nays, sqrtElectorate, ayes, sqrtTurnout);
  }

  return false;
}

async function getFinalizedBlockNumber(api) {
  const head = await api.rpc.chain.getFinalizedHead();
  return (await api.query.system.number.at(head)).toNumber();
}

const electorates = {};

export async function getElectorate(api, height) {
  let blockHeight = height;
  if (!blockHeight) {
    blockHeight = await getFinalizedBlockNumber(api);
  }

  if (electorates[blockHeight]) {
    return electorates[blockHeight];
  }

  const value = await api.query.balances.totalIssuance();
  electorates[blockHeight] = value;
  return value;
}

export async function getAddressVotingBalance(api, address) {
  const account = await api.query.system.account(address);
  const jsonAccount = account?.toJSON();
  return jsonAccount?.data?.free;
}

const Conviction = {
  None: 0,
  Locked1x: 1,
  Locked2x: 2,
  Locked3x: 3,
  Locked4x: 4,
  Locked5x: 5,
  Locked6x: 6,
};

export async function getAddressVote(api, referendumIndex, address) {
  const voting = await api.query.democracy.votingOf(address);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return null;
  }

  // For the direct vote, just return the vote.
  if (jsonVoting.direct) {
    const vote = (jsonVoting.direct.votes || []).find(
      (vote) => vote[0] === referendumIndex
    )?.[1];

    return {
      ...vote,
      delegations: jsonVoting.direct.delegations,
    };
  }

  // If the address has delegated to other.
  if (jsonVoting.delegating) {
    // Then, look into the votes of the delegating target address.
    const { target, conviction } = jsonVoting.delegating;
    const proxyVoting = await api.query.democracy.votingOf(target);
    const jsonProxyVoting = proxyVoting?.toJSON();

    const vote = (jsonProxyVoting?.direct?.votes || []).find(
      (vote) => vote[0] === referendumIndex
    )?.[1];

    if (!vote?.standard) {
      return {
        delegating: {
          ...jsonVoting.delegating,
          conviction: Conviction[conviction],
          voted: false,
        },
      };
    }

    // If the delegating target address has standard vote on this referendum,
    // means this address has voted on this referendum.
    const aye = isAye(vote.standard.vote);
    return {
      delegating: {
        ...jsonVoting.delegating,
        conviction: Conviction[conviction],
        voted: true,
        aye,
      },
    };
  }

  return null;
}

const AYE_BITS = 0b10000000;
const CON_MASK = 0b01111111;

export const isAye = (vote) => (vote & AYE_BITS) === AYE_BITS;
export const getConviction = (vote) => vote & CON_MASK;

export const convictionToLockX = (conviction) => {
  switch (conviction) {
    case 0:
      return "0.1x";
    case 1:
      return "1x";
    case 2:
      return "2x";
    case 3:
      return "3x";
    case 4:
      return "4x";
    case 5:
      return "5x";
    case 6:
      return "6x";
    default:
      return "0.1x";
  }
};
