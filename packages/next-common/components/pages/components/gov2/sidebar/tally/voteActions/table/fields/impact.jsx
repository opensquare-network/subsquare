import { useChainSettings } from "next-common/context/chain";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import BigNumber from "bignumber.js";
import { VOTE_TYPE_CONFIG, OPENGOV_ACTIONS } from "../common";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

const ZERO_VOTES = {
  impact: false,
  votes: 0,
};

function getVotesWithConviction(balance, conviction) {
  if (conviction <= 0) {
    return BigInt(balance) / BigInt(10);
  } else {
    return BigInt(balance) * BigInt(convictionToLockXNumber(conviction));
  }
}

function absBigInt(x) {
  if (typeof x !== "bigint") {
    throw new TypeError("Input must be a BigInt");
  }
  return x < 0n ? -x : x;
}

function getSplitVotes(aye, nay) {
  return BigInt(aye) - BigInt(nay);
}

function getDirectVotes(vote, delegations) {
  if (!vote) {
    return BigInt(0);
  }

  const { isSplit, isSplitAbstain, isStandard } = vote;
  if (isSplit || isSplitAbstain) {
    const { aye = 0, nay = 0 } = vote?.vote || {};
    return getSplitVotes(aye, nay);
  } else if (!isStandard) {
    throw new Error("Unknown direct vote type");
  }

  const {
    balance,
    vote: { isAye, conviction },
  } = vote?.vote || {};
  const { votes: delegationVotes = 0 } = delegations;
  const selfVotes = getVotesWithConviction(balance, conviction);
  const totalVotes = selfVotes + BigInt(delegationVotes);
  return isAye ? totalVotes : BigInt(0) - totalVotes;
}

function getVoteActionImpact(data = {}) {
  const preImpactVotes = getDirectVotes(data.preVote, data.delegations);
  const nowImpactVotes = getDirectVotes(data.vote, data.delegations);
  const finalVotes = nowImpactVotes - preImpactVotes;
  return {
    impact: finalVotes > 0,
    votes: absBigInt(finalVotes),
  };
}

function getRemoveVoteActionImpact(data) {
  const { isSplit, isSplitAbstain } = data?.vote || {};
  if (isSplit || isSplitAbstain) {
    const { aye, nay } = data?.vote?.vote || {};
    const votes = getSplitVotes(aye, nay);
    return {
      impact: votes <= 0,
      votes: absBigInt(votes),
    };
  }

  const {
    vote: { vote: { balance, vote: { isAye, conviction } = {} } } = {},
    delegations: { votes: delegationVotes } = {},
  } = data || {};
  const selfVotes = getVotesWithConviction(balance, conviction);
  const totalVotes = selfVotes + BigInt(delegationVotes);
  return {
    impact: !isAye,
    votes: totalVotes,
  };
}

function getDelegatedActionImpact(data) {
  const {
    vote: { isStandard, vote: { vote: { isAye } = {} } = {} } = {},
    delegation: { balance, conviction } = {},
    preDelegation,
  } = data || {};
  if (!isStandard) {
    return ZERO_VOTES;
  }

  let votes = getVotesWithConviction(balance, conviction);
  if (preDelegation) {
    const preVotes = getVotesWithConviction(
      preDelegation?.balance,
      preDelegation?.conviction,
    );
    votes -= preVotes;
  }
  return {
    impact: isAye && votes > 0,
    votes: absBigInt(votes),
  };
}

function getUndelegatedActionImpact(data) {
  const {
    vote: { isStandard, vote: { vote: { isAye } = {} } = {} } = {},
    delegation: { balance, conviction } = {},
  } = data || {};
  if (!isStandard) {
    return ZERO_VOTES;
  }

  const votes = getVotesWithConviction(balance, conviction);
  return {
    impact: !isAye,
    votes,
  };
}

const getImpactVotes = (data, type) => {
  if (!data || !type) {
    return ZERO_VOTES;
  }

  if (OPENGOV_ACTIONS.VOTE === type) {
    return getVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.REMOVE_VOTE === type) {
    return getRemoveVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.DELEGATED === type) {
    return getDelegatedActionImpact(data);
  } else if (OPENGOV_ACTIONS.UNDELEGATED === type) {
    return getUndelegatedActionImpact(data);
  }

  return ZERO_VOTES;
};

function ImpactVotesDisplay({ data, type }) {
  const { decimals } = useChainSettings();
  const impactVotes = getImpactVotes(data, type);

  if (!impactVotes || new BigNumber(impactVotes.votes).eq(0)) {
    return <span className="text-textPrimary">0</span>;
  }

  const { color } = VOTE_TYPE_CONFIG[impactVotes.impact ? "aye" : "nay"];

  return (
    <>
      <span className={color}>
        {impactVotes.impact ? "+" : "-"}
        <ValueDisplay
          value={toPrecision(impactVotes.votes, decimals)}
          symbol={""}
        />
      </span>
    </>
  );
}

export default function ImpactVotesField({ data, type }) {
  return (
    <div className="text-textTertiary text14Medium">
      <ImpactVotesDisplay data={data} type={type} />
      <span>&nbsp;VOTES</span>
    </div>
  );
}
