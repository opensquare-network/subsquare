import BigNumber from "bignumber.js";
import { usePageProps } from "next-common/context/page";

export function calculateImpact(vote, cohort) {
  let aye = BigNumber(0);
  let nay = BigNumber(0);

  if (vote.isStandard) {
    if (vote.aye) {
      aye = aye.plus(cohort.delegation || 0);
    } else {
      nay = nay.plus(cohort.delegation || 0);
    }
  }

  return {
    aye,
    nay,
  };
}

export function useInfluence(tally, approval, dvVotes = []) {
  const { cohort } = usePageProps();
  if (!tally || !approval || !cohort) {
    return false;
  }

  const tallyAye = BigNumber(tally.ayes);
  const tallyNay = BigNumber(tally.nays);

  const dvTotalImpact = dvVotes.reduce(
    (sum, vote) => {
      const impact = calculateImpact(vote, cohort);
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
