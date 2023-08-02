import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";

export function ReferendumTag({ proposal, isGov2 }) {
  if (isGov2) {
    return (
      <Gov2ReferendaTag
        state={proposal?.state?.name}
        args={getGov2ReferendumStateArgs(proposal?.state)}
      />
    );
  }

  return (
    <DemocracyReferendumTag
      state={proposal?.state?.state}
      args={getDemocracyStateArgs(proposal?.state, proposal?.timeline)}
    />
  );
}
