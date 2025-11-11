import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { useIsFellowship, useIsReferenda } from "./moduleTab";
import { capitalize } from "lodash-es";

function OpenGovReferendaTag({ proposal, vote }) {
  if (proposal?.state?.name) {
    return (
      <Gov2ReferendaTag
        state={proposal?.state?.name}
        args={getGov2ReferendumStateArgs(proposal?.state)}
      />
    );
  }

  const { referendumInfo } = vote || {};
  if (referendumInfo) {
    return (
      <Gov2ReferendaTag state={capitalize(Object.keys(referendumInfo)[0])} />
    );
  }

  return null;
}

function DemocracyTag({ proposal, vote }) {
  if (proposal?.state?.state) {
    return (
      <DemocracyReferendumTag
        state={proposal?.state?.state}
        args={getDemocracyStateArgs(proposal?.state, proposal?.timeline)}
      />
    );
  }

  const { referendumInfo } = vote || {};
  if (referendumInfo) {
    const [state, args] = Object.entries(referendumInfo || {})[0] || [];
    return <DemocracyReferendumTag state={capitalize(state)} args={args} />;
  }

  return null;
}

export function ReferendumTag({ proposal, vote }) {
  const isReferenda = useIsReferenda();
  const isFellowship = useIsFellowship();
  if (isReferenda || isFellowship) {
    return <OpenGovReferendaTag proposal={proposal} vote={vote} />;
  }

  return <DemocracyTag proposal={proposal} vote={vote} />;
}
