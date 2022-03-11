import Proposal from "next-common/components/proposal";

export function makeExternalMetadata(detail, chain) {
  const metadata = [
    ["hash", detail.onchainData.proposalHash],
    ["voteThreshould", detail.onchainData.voteThreshold],
  ];
  if (detail?.onchainData?.preImage) {
    metadata.push([
      <Proposal
        motion={{ proposal: detail.onchainData.preImage.call }}
        chain={chain}
      />,
    ]);
  }
  return metadata;
}
