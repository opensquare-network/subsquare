import ExternalProposeVoteThresholdPopup from "./common/externalProposeVoteThresholdPopup";

export default function ExternalProposeMajorityPopup({ onClose }) {
  return (
    <ExternalProposeVoteThresholdPopup
      method="externalProposeMajority"
      onClose={onClose}
    />
  );
}
