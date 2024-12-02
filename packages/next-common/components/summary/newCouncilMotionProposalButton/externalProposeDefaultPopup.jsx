import ExternalProposeVoteThresholdPopup from "./common/externalProposeVoteThresholdPopup";

export default function ExternalProposeDefaultPopup({ isMember, onClose }) {
  return (
    <ExternalProposeVoteThresholdPopup
      method="externalProposeDefault"
      isMember={isMember}
      onClose={onClose}
    />
  );
}
