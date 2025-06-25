import { useChainSettings } from "next-common/context/chain";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import { VOTE_TYPE_CONFIG, OPENGOV_ACTIONS } from "../../common";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { cn } from "next-common/utils";
import { EMPTY_OBJECT } from "next-common/utils/consts/common";
import { isNil } from "lodash-es";

const ZERO_BIGINT = BigInt(0);

function getConvictionZeroVotes(balance = 0) {
  return BigInt(balance) / BigInt(10);
}

function getVotesWithConviction(balance, conviction) {
  if (conviction <= 0) {
    return getConvictionZeroVotes(balance);
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
  return getConvictionZeroVotes(aye) - getConvictionZeroVotes(nay);
}

function getDirectVotes(vote, delegations) {
  if (!vote) {
    return BigInt(0);
  }

  const { isSplit, isSplitAbstain, isStandard } = vote;
  if (isSplit || isSplitAbstain) {
    const { aye = 0, nay = 0 } = vote?.vote || EMPTY_OBJECT;
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
  if (isSplit) {
    const { aye = 0 } = vote?.vote || EMPTY_OBJECT;
    return BigInt(aye);
  } else if (isSplitAbstain) {
    const { aye = 0, abstain = 0 } = vote?.vote || EMPTY_OBJECT;
    return BigInt(aye) + BigInt(abstain);
  } else if (!isStandard) {
    throw new Error("Unknown direct vote type");
  }

  const {
    balance,
    vote: { isAye },
  } = vote?.vote || EMPTY_OBJECT;
  const { capital: delegationCapital = 0 } = delegations;
  let support = BigInt(0);
  if (isAye) {
    support += BigInt(balance);
    support += BigInt(delegationCapital);
  }
  return support;
}

function getVoteActionImpact(data = EMPTY_OBJECT) {
  const preImpactVotes = getDirectVotes(data.preVote, data.delegations);
  const nowImpactVotes = getDirectVotes(data.vote, data.delegations);
  return nowImpactVotes - preImpactVotes;
}

function getSupportVoteActionImpact(data = {}) {
  const preImpactSupport = getDirectSupport(data.preVote, data.delegations);
  const nowImpactSupport = getDirectSupport(data.vote, data.delegations);
  return nowImpactSupport - preImpactSupport;
}

function getRemoveVoteActionImpact(data) {
  const voteImpact = getDirectVotes(data.vote, data.delegations);
  return -voteImpact;
}

function getSupportRemoveVoteActionImpact(data) {
  const voteImpact = getDirectSupport(data.vote, data.delegations);
  return -voteImpact;
}

function getDelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance, conviction } = EMPTY_OBJECT,
    preDelegation,
  } = data || EMPTY_OBJECT;
  if (!isStandard) {
    return ZERO_BIGINT;
  }

  let votes = getVotesWithConviction(balance, conviction);
  if (preDelegation) {
    const preVotes = getVotesWithConviction(
      preDelegation?.balance,
      preDelegation?.conviction,
    );
    votes -= preVotes;
  }
  return isAye ? votes : -votes;
}

function getSupportDelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance } = EMPTY_OBJECT,
    preDelegation,
  } = data || EMPTY_OBJECT;
  if (!isStandard || !isAye) {
    return ZERO_BIGINT;
  }

  let support = BigInt(balance);
  if (preDelegation) {
    support -= BigInt(preDelegation?.balance || 0);
  }
  return support;
}

function getUndelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance, conviction } = EMPTY_OBJECT,
  } = data || EMPTY_OBJECT;
  if (!isStandard) {
    return ZERO_BIGINT;
  }

  const votes = getVotesWithConviction(balance, conviction);
  return isAye ? -votes : votes;
}

function getSupportUndelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance } = EMPTY_OBJECT,
  } = data || EMPTY_OBJECT;
  if (!isStandard || !isAye) {
    return ZERO_BIGINT;
  }

  const support = BigInt(balance);
  return -support;
}

const getImpactVotes = (data, type) => {
  if (!data || !type) {
    return ZERO_BIGINT;
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

  return ZERO_BIGINT;
};

const getSupportImpactVotes = (data, type) => {
  if (!data || !type) {
    return ZERO_BIGINT;
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

  return ZERO_BIGINT;
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

  if (isNil(impactVotes) || BigInt(impactVotes) === BigInt(0)) {
    return <NoImpact />;
  }

  const isAye = impactVotes >= 0;
  const { color } = VOTE_TYPE_CONFIG[isAye ? "aye" : "nay"];

  return (
    <>
      <div className={cn(color, "inline-flex")}>
        {isAye ? "+" : "-"}
        <ValueDisplay
          value={toPrecision(absBigInt(impactVotes), decimals)}
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
