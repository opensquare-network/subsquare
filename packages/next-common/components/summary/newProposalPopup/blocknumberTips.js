import { useChainSettings } from "next-common/context/chain";

export default function BlocknumberTips() {
  const { assethubMigration } = useChainSettings();

  if (!assethubMigration?.migrated) {
    return null;
  }

  return (
    <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium text-textSecondary">
      The block number is relative to the relay chain best number.
    </div>
  );
}
