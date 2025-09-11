import Induct from "./induct";
import Import from "next-common/components/fellowship/core/summary/import";

export default function AmbassadorSummaryActions() {
  return (
    <div className="flex justify-end gap-2">
      <Induct />
      <Import />
    </div>
  );
}
