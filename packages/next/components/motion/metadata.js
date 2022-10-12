import CollectiveMetadata from "next-common/components/collective/metadata";
import { usePostOnChainData } from "next-common/context/post";
import { useChain } from "next-common/context/chain";

export default function Metadata() {
  const motion = usePostOnChainData();
  const chain = useChain();
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
