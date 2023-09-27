import { SystemEmptyBox } from "@osn/icons/subsquare";

export default function NoComment() {
  return (
    <div className="py-6">
      <SystemEmptyBox className="[&_path]:stroke-textTertiary w-10 h-10 mx-auto" />

      <p className="mt-2 text14Medium text-textTertiary text-center">
        There are no comments here
      </p>
    </div>
  );
}
