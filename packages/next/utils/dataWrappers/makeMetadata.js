import MotionProposal from "../../components/motion/motionProposal";

export function makeExternalMetadata(detail, chain) {
  const metadata = [
    ["hash", detail.onchainData.proposalHash],
    ["voteThreshould", detail.onchainData.voteThreshold],
  ];
  if (detail?.onchainData?.preImage) {
    metadata.push([
      <MotionProposal
        motion={{ proposal: detail.onchainData.preImage.call }}
        chain={chain}
      />,
    ]);
  }
  return metadata;
}
