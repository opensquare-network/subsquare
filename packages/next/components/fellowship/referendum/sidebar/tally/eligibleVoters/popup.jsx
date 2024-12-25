import Popup from "next-common/components/popup/wrapper/Popup";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import UnVoted from "./unVoted";
import Voted from "./voted";
import useCollectiveEligibleVoters from "next-common/utils/hooks/collectives/useCollectiveEligibleVoters";

function HeaderPrompt() {
  return (
    <GreyPanel className="justify-start gap-x-2 text14Medium text-textSecondary py-2.5 px-4 max-w-full">
      The data of eligible voters is from this referendum period, not the
      current time.
    </GreyPanel>
  );
}

export default function EligibleVotersPopup({ setShowEligibleVoters }) {
  const { votedMembers, unVotedMembers, isLoading } =
    useCollectiveEligibleVoters();

  return (
    <Popup
      title="Eligible Voters"
      onClose={() => setShowEligibleVoters(false)}
      className="max-h-[640px]"
    >
      <HeaderPrompt />
      <div className="max-h-[450px] overflow-auto">
        <Voted votedMembers={votedMembers} isLoading={isLoading} />
        <UnVoted unVotedMembers={unVotedMembers} isLoading={isLoading} />
      </div>
    </Popup>
  );
}
