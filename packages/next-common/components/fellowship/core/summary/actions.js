import Induct from "next-common/components/fellowship/core/summary/induct";
import Import from "next-common/components/fellowship/core/summary/import";

export default function FellowshipSummaryActions() {
  return (
    <div className="flex justify-end gap-2">
      <Induct />
      <Import />
    </div>
  );
}
