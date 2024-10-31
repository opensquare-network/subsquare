import SummaryLayout from "next-common/components/summary/layout/layout";
import Revenue from "./columns/revenue";
import AvailableCores from "./columns/availableCores";
import StartTime from "./columns/startTime";
import EndTime from "./columns/endTime";

export default function CoretimeDetailSaleSummary() {
  return (
    <div>
      <SummaryLayout>
        <Revenue />
        <AvailableCores />
        <StartTime />
        <EndTime />
      </SummaryLayout>
    </div>
  );
}
