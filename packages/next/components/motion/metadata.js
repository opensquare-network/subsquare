import CollectiveMetadata from "next-common/components/collective/metadata";
import { usePostOnChainData } from "next-common/context/post";

export default function Metadata({ chain }) {
  const motion = usePostOnChainData();
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
