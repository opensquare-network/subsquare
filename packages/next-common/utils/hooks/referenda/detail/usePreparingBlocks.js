import { useTrack } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useOnchainData } from "next-common/context/post";

export default function usePreparingBlocks() {
  const track = useTrack();
  const decidingBlockHeight = useDecidingSince();
  const onchainData = useOnchainData();
  const createBlockHeight = onchainData.indexer.blockHeight;

  if (decidingBlockHeight) {
    return decidingBlockHeight - createBlockHeight;
  }

  return track.preparePeriod;
}
