import { SystemEmptyBox } from "@osn/icons/subsquare";

export default function ImportMultisigEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <SystemEmptyBox className="text-textTertiary" />
      <div className="text-textTertiary text14Medium">No multisig found</div>
    </div>
  );
}
