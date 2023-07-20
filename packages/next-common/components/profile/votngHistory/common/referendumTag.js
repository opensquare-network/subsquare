import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";

export default function ReferendumTag({ vote, isGov2 }) {
  if (isGov2) {
    return (
      <Gov2ReferendaTag
        state={vote.proposal?.state?.name}
        args={getGov2ReferendumStateArgs(vote.proposal?.state)}
      />
    );
  }

  return (
    <DemocracyReferendumTag
      state={vote.proposal?.state?.state}
      args={getDemocracyStateArgs(
        vote.proposal?.state,
        vote.proposal?.timeline,
      )}
    />
  );
}
