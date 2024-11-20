import SummaryLayout from "next-common/components/summary/layout/layout";
import Revenue from "./columns/revenue";
import AvailableCores from "./columns/availableCores";
import StartTime from "./columns/startTime";
import EndTime from "./columns/endTime";
import Regions from "next-common/components/coretime/salePanel/summary/columns/regions";

export default function CoretimeHistoricalSaleSummary() {
  return (
    <div>
      <SummaryLayout>
        <Revenue />
        <AvailableCores />
        <StartTime />
        <EndTime />
        <Regions />
      </SummaryLayout>
    </div>
  );
}
