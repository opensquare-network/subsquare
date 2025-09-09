import { SystemYes, SystemNo } from "@osn/icons/subsquare";
import BigNumber from "bignumber.js";
import { PostProvider } from "next-common/context/post";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";

export function InfluenceValueImpl({ referendumVotes }) {
  const tally = useReferendumTally();
  const approval = useApprovalThreshold();

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

  const isPass = tallyAye.div(tallyNay).gt(approval);
  const noDvIsPass = noDvAye.div(noDvNay).gt(approval);

  const icon = isPass !== noDvIsPass ? <SystemYes /> : <SystemNo />;

  return <div className="flex justify-end">{icon}</div>;
}

export default function InfluenceValue({ referendum, referendumVotes = [] }) {
  return (
    <PostProvider post={referendum}>
      <InfluenceValueImpl referendumVotes={referendumVotes} />
    </PostProvider>
  );
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
