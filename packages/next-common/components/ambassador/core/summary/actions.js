import Induct from "next-common/components/ambassador/core/summary/induct";
import Import from "next-common/components/ambassador/core/summary/import";

export default function AmbassadorSummaryActions() {
  return (
    <div className="flex justify-end gap-2">
      <Induct />
      <Import />
    </div>
  );
}
