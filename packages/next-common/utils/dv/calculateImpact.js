import BigNumber from "bignumber.js";

export function calculateImpact(vote) {
  let aye = BigNumber(0);
  let nay = BigNumber(0);

  // todo: add more types support
  if (vote.isStandard) {
    if (vote.aye) {
      aye = aye.plus(vote.delegations?.votes || 0);
    } else {
      nay = nay.plus(vote.delegations?.votes || 0);
    }
  }

  return {
    aye,
    nay,
  };
}

export function getInfluence(tally, approval, dvVotes = []) {
  if (!tally || !approval) {
    return false;
  }

  const tallyAye = BigNumber(tally.ayes);
  const tallyNay = BigNumber(tally.nays);

  if (!tallyAye || !tallyNay) {
    return null;
  }

  const dvTotalImpact = dvVotes.reduce(
    (sum, v) => {
      const impact = calculateImpact(v);
      return {
        aye: sum.aye.plus(impact.aye),
        nay: sum.nay.plus(impact.nay),
      };
    },
    { aye: BigNumber(0), nay: BigNumber(0) },
  );

  const denominator = tallyAye.plus(tallyNay);

  const noDvAye = tallyAye.minus(dvTotalImpact.aye);
  const noDvNay = tallyNay.minus(dvTotalImpact.nay);

  const noDvDenominator = noDvAye.plus(noDvNay);

  const isPass = tallyAye.div(denominator).gt(approval);
  const noDvIsPass = noDvAye.div(noDvDenominator).gt(approval);

  return isPass !== noDvIsPass;
}
