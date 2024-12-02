import ExternalProposeVoteThresholdPopup from "./common/externalProposeVoteThresholdPopup";

export default function ExternalProposeMajorityPopup({ isMember, onClose }) {
  return (
    <ExternalProposeVoteThresholdPopup
      method="externalProposeMajority"
      isMember={isMember}
      onClose={onClose}
    />
  );
}
