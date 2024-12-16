import ExternalProposeVoteThresholdPopup from "./common/externalProposeVoteThresholdPopup";

export default function ExternalProposeMajorityPopup({ isMember }) {
  return (
    <ExternalProposeVoteThresholdPopup
      method="externalProposeMajority"
      isMember={isMember}
    />
  );
}
