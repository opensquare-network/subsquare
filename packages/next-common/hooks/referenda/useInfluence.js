import BigNumber from "bignumber.js";
import { noop } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useApprovalCurve } from "next-common/context/post/gov2/curve";

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

export function useInfluence(tally, dvVotes = []) {
  const { cohort } = usePageProps();
  const approvalCurve = useApprovalCurve();

  return getInfluence(tally, dvVotes, cohort, approvalCurve);
}

export function getInfluence(
  tally,
  dvVotes = [],
  cohort,
  approvalCurve = noop,
) {
  if (!tally || !cohort) {
    return false;
  }

  // Always use 100% approval to calculate influence
  const approval = approvalCurve(1);
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

  return {
    isPass,
    noDvIsPass,
    hasInfluence: isPass !== noDvIsPass,
  };
}
