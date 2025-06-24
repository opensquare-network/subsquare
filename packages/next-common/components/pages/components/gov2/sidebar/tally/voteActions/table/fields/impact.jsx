import { useChainSettings } from "next-common/context/chain";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import { VOTE_TYPE_CONFIG, OPENGOV_ACTIONS } from "../../common";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { cn } from "next-common/utils";

const ZERO_VOTES = { votes: 0 };

function getVotesWithConviction(balance, conviction) {
  if (conviction <= 0) {
    return BigInt(balance) / BigInt(10);
  } else {
    return BigInt(balance) * BigInt(convictionToLockXNumber(conviction));
  }
}

function getRawVotes(balance) {
  return BigInt(balance);
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

function getDirectSupport(vote, delegations) {
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
    vote: { isAye },
  } = vote?.vote || {};
  const { votes: delegationVotes = 0 } = delegations;
  const selfSupport = getRawVotes(balance);
  const totalSupport = selfSupport + BigInt(delegationVotes);
  return isAye ? totalSupport : BigInt(0) - totalSupport;
}

function getVoteActionImpact(data = {}) {
  const preImpactVotes = getDirectVotes(data.preVote, data.delegations);
  const nowImpactVotes = getDirectVotes(data.vote, data.delegations);
  const finalVotes = nowImpactVotes - preImpactVotes;
  return { votes: finalVotes };
}

function getSupportVoteActionImpact(data = {}) {
  const preImpactSupport = getDirectSupport(data.preVote, data.delegations);
  const nowImpactSupport = getDirectSupport(data.vote, data.delegations);
  const finalSupport = nowImpactSupport - preImpactSupport;
  return { votes: finalSupport };
}

function getRemoveVoteActionImpact(data) {
  const voteImpact = getDirectVotes(data.vote, data.delegations);
  return { votes: -voteImpact };
}

function getSupportRemoveVoteActionImpact(data) {
  const voteImpact = getDirectSupport(data.vote, data.delegations);
  return { votes: -voteImpact };
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
  return { votes: isAye ? votes : -votes };
}

function getSupportDelegatedActionImpact(data) {
  const {
    vote: { isStandard, vote: { vote: { isAye } = {} } = {} } = {},
    delegation: { balance } = {},
    preDelegation,
  } = data || {};
  if (!isStandard) {
    return ZERO_VOTES;
  }

  let support = getRawVotes(balance);
  if (preDelegation) {
    const preSupport = getRawVotes(preDelegation?.balance);
    support -= preSupport;
  }
  return { votes: isAye ? support : -support };
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
  return { votes: isAye ? -votes : votes };
}

function getSupportUndelegatedActionImpact(data) {
  const {
    vote: { isStandard, vote: { vote: { isAye } = {} } = {} } = {},
    delegation: { balance } = {},
  } = data || {};
  if (!isStandard) {
    return ZERO_VOTES;
  }

  const support = getRawVotes(balance);
  return { votes: isAye ? -support : support };
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

const getSupportImpactVotes = (data, type) => {
  if (!data || !type) {
    return ZERO_VOTES;
  }

  if (OPENGOV_ACTIONS.VOTE === type) {
    return getSupportVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.REMOVE_VOTE === type) {
    return getSupportRemoveVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.DELEGATED === type) {
    return getSupportDelegatedActionImpact(data);
  } else if (OPENGOV_ACTIONS.UNDELEGATED === type) {
    return getSupportUndelegatedActionImpact(data);
  }

  return ZERO_VOTES;
};

function NoImpact() {
  const { symbol } = useChainSettings();

  return (
    <span className="text-textTertiary text14Medium">
      <span className="text-textPrimary text14Medium">0</span>
      &nbsp;
      <span>{symbol}</span>
    </span>
  );
}

function ImpactVotesDisplay({ data, type, isSupport = false }) {
  const { decimals, symbol } = useChainSettings();
  const impactVotes = isSupport
    ? getSupportImpactVotes(data, type)
    : getImpactVotes(data, type);

  if (!impactVotes || BigInt(impactVotes.votes) === BigInt(0)) {
    return <NoImpact />;
  }

  const isAye = impactVotes.votes >= 0;
  const { color } = VOTE_TYPE_CONFIG[isAye ? "aye" : "nay"];

  return (
    <>
      <div className={cn(color, "inline-flex")}>
        {isAye ? "+" : "-"}
        <ValueDisplay
          value={toPrecision(absBigInt(impactVotes.votes), decimals)}
          symbol={symbol}
        />
      </div>
    </>
  );
}

function TallyVotesDisplay({ data, type }) {
  return (
    <div>
      <span>Tally: </span>
      <ImpactVotesDisplay data={data} type={type} />
    </div>
  );
}

function SupportVotesDisplay({ data, type }) {
  return (
    <div>
      <span>Support: </span>
      <ImpactVotesDisplay data={data} type={type} isSupport={true} />
    </div>
  );
}

export default function ImpactVotesField({ data, type }) {
  return (
    <div className="text-textTertiary text14Medium max-md:flex max-md:flex-col max-md:items-end">
      <TallyVotesDisplay data={data} type={type} />
      <SupportVotesDisplay data={data} type={type} />
    </div>
  );
}
