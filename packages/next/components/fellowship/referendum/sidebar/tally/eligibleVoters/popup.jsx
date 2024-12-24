import Popup from "next-common/components/popup/wrapper/Popup";

export default function EligibleVotersPopup({ setShowEligibleVoters }) {
  return (
    <Popup title="Eligible Voters" onClose={() => setShowEligibleVoters(false)}>
      Eligible Voters details
    </Popup>
  );
}
