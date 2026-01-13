import { useChainSettings } from "next-common/context/chain";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";

export default function useAhmBlockTime() {
  const blockTime = useSelector(blockTimeSelector);
  const settings = useChainSettings();
  const { assethubMigration } = settings || {};
  return assethubMigration?.migrated
    ? assethubMigration?.relayBlockTime
    : blockTime;
}
