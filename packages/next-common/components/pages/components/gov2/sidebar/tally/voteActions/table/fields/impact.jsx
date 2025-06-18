import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber } from "next-common/utils";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import { VOTE_TYPE_CONFIG, isDirectVote, isDelegation } from "../common";

const getImpactVotes = (data, type) => {
  if (isDirectVote(type)) {
    return getDirectImpactVotes(data);
  }

  if (isDelegation(type)) {
    return getDelegationImpactVotes(data);
  }

  return null;
};

const getDirectImpactVotes = (data) => {
  if (data?.isStandard) {
    const balance = data?.vote?.balance.toString();
    const conviction = data?.vote?.vote?.conviction;
    const isAye = data?.vote?.vote?.isAye;
    const delegationVotes = data?.delegations?.votes || 0;

    const selfVotes = new BigNumber(balance)
      .times(convictionToLockXNumber(conviction))
      .toString();

    const totalVotes = new BigNumber(selfVotes)
      .plus(delegationVotes)
      .toString();

    return {
      impact: isAye,
      votes: totalVotes,
    };
  }

  if (data?.isSplit || data?.isSplitAbstain) {
    const ayeVotes = new BigNumber(data?.vote?.aye);
    const nayVotes = new BigNumber(data?.vote?.nay);
    const netVotes = ayeVotes.minus(nayVotes);

    return {
      impact: netVotes.gt(0),
      votes: netVotes.abs().toString(),
    };
  }

  return null;
};

const getDelegationImpactVotes = (data) => {
  const conviction = data?.delegation?.conviction;
  const delegationVotes = new BigNumber(data?.delegation?.balance || 0)
    .times(convictionToLockXNumber(conviction))
    .toString();

  return {
    // TODO: data?.delegation?.isAye
    // Mock data.
    impact: false,
    votes: delegationVotes,
  };
};

function ImpactVotesDisplay({ impactVotes, decimals }) {
  if (!impactVotes || new BigNumber(impactVotes.votes).eq(0)) {
    return (
      <div className="text-textTertiary text14Medium">
        0<span>&nbsp;VOTES</span>
      </div>
    );
  }

  const { color } = VOTE_TYPE_CONFIG[impactVotes.impact ? "aye" : "nay"];
  const formattedVotes = abbreviateBigNumber(
    toPrecisionNumber(impactVotes.votes, decimals),
  );

  return (
    <div className="text-textTertiary text14Medium">
      <span className={color}>
        {impactVotes.impact ? "+" : "-"}
        <span>{formattedVotes}</span>
      </span>
      <span>&nbsp;VOTES</span>
    </div>
  );
}

export default function ImpactVotesField({ data, type }) {
  const { decimals } = useChainSettings();
  const impactVotes = getImpactVotes(data, type);

  return <ImpactVotesDisplay impactVotes={impactVotes} decimals={decimals} />;
}
