import { SystemYes, SystemNo } from "@osn/icons/subsquare";
import BigNumber from "bignumber.js";

export default function InfluenceValue({ referendum, referendumVotes = [] }) {
  const tally = referendum?.onchainData?.tally;

  if (!tally) {
    return null;
  }

  const tallyAye = BigNumber(tally.ayes);
  const tallyNay = BigNumber(tally.nays);

  if (!tallyAye || !tallyNay) {
    return null;
  }

  const dvTotalImpact = referendumVotes.reduce(
    (sum, v) => {
      const impact = calculateImpact(v);
      return {
        aye: sum.aye.plus(impact.aye),
        nay: sum.nay.plus(impact.nay),
      };
    },
    { aye: BigNumber(0), nay: BigNumber(0) },
  );

  const noDvAye = tallyAye.minus(dvTotalImpact.aye);
  const noDvNay = tallyNay.minus(dvTotalImpact.nay);

  const isPass = tallyAye.gt(tallyNay);
  const noDvIsPass = noDvAye.gt(noDvNay);

  const icon = isPass !== noDvIsPass ? <SystemYes /> : <SystemNo />;

  return <div className="flex justify-end">{icon}</div>;
}

function calculateImpact(vote) {
  let aye = BigNumber(0);
  let nay = BigNumber(0);

  // todo: add more types support
  if (vote.isStandard) {
    if (vote.aye) {
      aye = aye.plus(vote.delegations?.votes["$numberDecimal"] || 0);
    } else {
      nay = nay.plus(vote.delegations?.votes["$numberDecimal"] || 0);
    }
  }

  return {
    aye,
    nay,
  };
}
