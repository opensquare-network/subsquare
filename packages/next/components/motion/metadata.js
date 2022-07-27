import CollectiveMetadata from "next-common/components/collective/metadata";

export default function Metadata({ motion, chain }) {
  if (!motion) {
    return null;
  }

  return (
    <CollectiveMetadata
      chain={chain}
      index={motion?.index}
      proposer={motion?.proposer}
      threshold={motion?.threshold}
      hash={motion?.hash}
      call={motion.proposal}
    />
  );
}
