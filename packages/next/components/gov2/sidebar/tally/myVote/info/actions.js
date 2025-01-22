import { useChainSettings } from "next-common/context/chain";
import { Button, LinkButton } from "next-common/components/myReferendumVote";
import { Referenda } from "next-common/components/profile/votingHistory/common";
import { useSharedPopupOpenState } from "next-common/context/popup/switch";

export default function MyVoteActions({ remove = true }) {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();
  const hasDemocracyModule = democracy && !democracy?.archived;
  const hasVotesManagement = hasReferenda || hasDemocracyModule;
  const [, setPopupOpen] = useSharedPopupOpenState();

  return (
    <div className="flex justify-end gap-[16px]">
      {hasVotesManagement && (
        <LinkButton href={`/votes?type=${Referenda}`}>
          <span>Manage My Votes</span>
        </LinkButton>
      )}
      {remove && <Button onClick={() => setPopupOpen(true)}>Remove</Button>}
    </div>
  );
}
