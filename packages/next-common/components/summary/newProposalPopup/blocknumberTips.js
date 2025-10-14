import { useChainSettings } from "next-common/context/chain";

export default function BlocknumberTips() {
  const { assethubMigration } = useChainSettings();

  if (!assethubMigration?.migrated) {
    return null;
  }

  return (
    <div className="text12Medium text-textTertiary">
      The block number is relative to the relay chain best number.
    </div>
  );
}
