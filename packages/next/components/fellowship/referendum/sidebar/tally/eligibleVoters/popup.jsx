import Popup from "next-common/components/popup/wrapper/Popup";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import UnVoted from "./unVoted";
import Voted from "./voted";

function HeaderPrompt() {
  return (
    <GreyPanel className="justify-start gap-x-2 text14Medium text-textSecondary py-2.5 px-4 max-w-full">
      The data of eligible voters is from this referendum period, not the
      current time.
    </GreyPanel>
  );
}

export default function EligibleVotersPopup({ setShowEligibleVoters }) {
  return (
    <Popup title="Eligible Voters" onClose={() => setShowEligibleVoters(false)} className="h-[640px]">
      <HeaderPrompt />
      <Voted />
      <UnVoted />
    </Popup>
  );
}
