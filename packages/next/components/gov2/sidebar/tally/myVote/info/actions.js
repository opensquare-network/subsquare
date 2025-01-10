import { useChainSettings } from "next-common/context/chain";
import { Button, LinkButton } from "next-common/components/myReferendumVote";
import { Referenda } from "next-common/components/profile/votingHistory/common";
import { useSharedRemovePopupOpen } from "next-common/context/referenda/myVote";

export default function MyVoteActions({ remove = true }) {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();
  const hasDemocracyModule = democracy && !democracy?.archived;
  const hasVotesManagement = hasReferenda || hasDemocracyModule;
  const [, setRemovePopupOpen] = useSharedRemovePopupOpen();

  return (
    <div className="flex justify-end gap-[16px]">
      {hasVotesManagement && (
        <LinkButton href={`/votes?type=${Referenda}`}>
          <span>Manage My Votes</span>
        </LinkButton>
      )}
      {remove && (
        <Button onClick={() => setRemovePopupOpen(true)}>Remove</Button>
      )}
    </div>
  );
}
