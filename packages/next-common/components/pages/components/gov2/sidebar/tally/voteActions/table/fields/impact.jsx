import { useChainSettings } from "next-common/context/chain";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import { VOTE_TYPE_CONFIG, isDirectVote, isDelegation } from "../common";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

const ZERO_VOTES = {
  impact: false,
  votes: 0,
};

const calculateVotesWithConviction = (balance, conviction) => {
  return new BigNumber(balance).times(convictionToLockXNumber(conviction));
};

const getDirectImpactVotes = (data) => {
  if (data?.isStandard) {
    const {
      balance,
      vote: { conviction, isAye },
    } = data.vote;
    const delegationVotes = data?.delegations?.votes || 0;

    const selfVotes = calculateVotesWithConviction(balance, conviction);
    const totalVotes = selfVotes.plus(delegationVotes);

    return {
      impact: isAye,
      votes: totalVotes.toString(),
    };
  }

  if (data?.isSplit || data?.isSplitAbstain) {
    const ayeVotes = new BigNumber(data.vote.aye);
    const nayVotes = new BigNumber(data.vote.nay);
    const netVotes = ayeVotes.minus(nayVotes);

    return {
      impact: netVotes.gt(0),
      votes: netVotes.abs().toString(),
    };
  }

  return null;
};

const getDelegationImpactVotes = (data) => {
  if (!data?.vote?.isStandard) {
    return ZERO_VOTES;
  }

  const delegationVotes = calculateVotesWithConviction(
    data?.delegation?.balance,
    data?.delegation?.conviction,
  );

  const isAye = data?.vote?.vote?.isAye;

  if (data?.preDelegation) {
    const preDelegationVotes = calculateVotesWithConviction(
      data?.preDelegation?.balance,
      data?.preDelegation?.conviction,
    );

    const votesDiff = delegationVotes.minus(preDelegationVotes);
    const impact = votesDiff.isNegative() ? !isAye : isAye;

    return {
      impact,
      votes: votesDiff.abs().toString(),
    };
  }

  return {
    impact: isAye,
    votes: delegationVotes.toString(),
  };
};

const getImpactVotes = (data, type) => {
  if (!data || !type) {
    return ZERO_VOTES;
  }

  if (isDirectVote(type)) {
    return getDirectImpactVotes(data);
  }

  if (isDelegation(type)) {
    return getDelegationImpactVotes(data);
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
