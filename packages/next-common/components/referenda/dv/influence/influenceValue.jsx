import { SystemYes, SystemNo } from "@osn/icons/subsquare";
import { PostProvider } from "next-common/context/post";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";
import { getInfluence } from "next-common/utils/dv/calculateImpact";

export function InfluenceValueImpl({ referendumVotes }) {
  const tally = useReferendumTally();
  const approval = useApprovalThreshold();
  const hasInfluence = getInfluence(tally, approval, referendumVotes);

  if (!tally || !approval) {
    return null;
  }

  const icon = hasInfluence ? <SystemYes /> : <SystemNo />;

  return <div className="flex justify-end">{icon}</div>;
}

export default function InfluenceValue({ referendum, referendumVotes = [] }) {
  if (!referendum) {
    return null;
  }

  return (
    <PostProvider post={referendum}>
      <InfluenceValueImpl referendumVotes={referendumVotes} />
    </PostProvider>
  );
}
