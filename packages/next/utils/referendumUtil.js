import BigNumber from "bignumber.js";
import { Conviction, convictionToLockX, getConviction, isAye } from "next-common/utils/referendumCommon";

export { isAye, Conviction, getConviction, convictionToLockX };

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

export async function getAddressVotingBalance(api, address) {
  const account = await api.query.system.account(address);
  const jsonAccount = account?.toJSON();
  return jsonAccount?.data?.free;
}

export async function getAddressVote(api, referendumIndex, address) {
  if (!api.query.democracy.votingOf) {
    return null;
  }
  const voting = await api.query.democracy?.votingOf(address);
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
    const proxyVoting = await api.query.democracy?.votingOf(target);
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

export function getTallyVotesBarPercent(tally) {
  const ayes = tally?.ayes ?? 0;
  const nays = tally?.nays ?? 0;

  let ayesPercent = 50;
  let naysPercent = 50;
  const nTotal = new BigNumber(ayes).plus(nays);
  if (nTotal.gt(0)) {
    ayesPercent = Math.round(new BigNumber(ayes).div(nTotal).toNumber() * 100);
    naysPercent = 100 - ayesPercent;
  }

  return {
    ayesPercent,
    naysPercent,
  };
}
