import CollectiveMetadata from "next-common/components/collective/metadata";
import { usePostOnChainData } from "next-common/context/post";

export default function Metadata() {
  const motion = usePostOnChainData();
  if (!motion) {
    return null;
  }

  return (
    <CollectiveMetadata
      index={motion?.index}
      proposer={motion?.proposer}
      threshold={motion?.threshold}
      hash={motion?.hash}
      call={motion.proposal}
    />
  );
}
