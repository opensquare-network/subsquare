import { useFilterMyVotes } from "next-common/hooks/referenda/useMyVotedCollectiveReferenda";
import { useContextCollectivesReferendaVotes } from "../collectivesVotes";
import { useMemo } from "react";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import { useContextMyCollectivesMember } from "./mine";
import { useContextCollectivesMembers } from "../collectivesMember";
import { useFilterReferendaByRank } from "next-common/hooks/referenda/useMyUnVotedCollectiveReferenda";
import { difference } from "lodash-es";

export function useMyVotedCollectiveReferenda() {
  const { votes: allVotes, isLoading } = useContextCollectivesReferendaVotes();
  const myVotes = useFilterMyVotes(allVotes);
  const myVotedReferenda = useMemo(
    () => (myVotes || []).map(({ referendumIndex }) => referendumIndex),
    [myVotes],
  );
  return { myVotedReferenda, isLoading };
}

export function useCollectiveActiveReferendaICanVote() {
  const { activeReferenda, isLoading: isLoadingActiveReferenda } =
    useActiveReferendaContext();
  const { isLoading: isLoadingCollectivesMembers } =
    useContextCollectivesMembers();
  const collectivesMember = useContextMyCollectivesMember();

  const isLoading = isLoadingActiveReferenda || isLoadingCollectivesMembers;

  const activeReferendaIndexAndTrackId = useMemo(
    () =>
      activeReferenda.map(({ referendumIndex, referendum }) => ({
        referendumIndex,
        trackId: referendum.track.toNumber(),
      })),
    [activeReferenda],
  );

  const referendaICanVote = useFilterReferendaByRank({
    activeReferenda: activeReferendaIndexAndTrackId,
    rank: collectivesMember?.rank,
    isLoading,
  });

  return {
    referendaICanVote,
    isLoading,
  };
}

export function useMyUnVotedReferenda() {
  const { myVotedReferenda } = useMyVotedCollectiveReferenda();
  const { referendaICanVote } = useCollectiveActiveReferendaICanVote();
  return useMemo(
    () => difference(referendaICanVote, myVotedReferenda),
    [referendaICanVote, myVotedReferenda],
  );
}
