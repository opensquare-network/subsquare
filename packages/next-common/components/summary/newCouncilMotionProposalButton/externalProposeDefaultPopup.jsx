import ExternalProposeVoteThresholdPopup from "./common/externalProposeVoteThresholdPopup";

export default function ExternalProposeDefaultPopup({ onClose }) {
  return (
    <ExternalProposeVoteThresholdPopup
      method="externalProposeDefault"
      onClose={onClose}
    />
  );
}
