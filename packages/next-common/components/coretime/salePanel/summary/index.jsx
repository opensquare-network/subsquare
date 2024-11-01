import SummaryLayout from "next-common/components/summary/layout/layout";
import CurrentPrice from "./columns/currentPrice";
import AvailableCores from "./columns/availableCores";
import CurrentPhase from "./columns/currentPhase";
import TotalPeriod from "./columns/totalPeriod";

export default function CoretimeSaleSummary() {
  return (
    <div>
      <SummaryLayout>
        <CurrentPrice />
        <AvailableCores />
        <CurrentPhase />
        <TotalPeriod />
      </SummaryLayout>
    </div>
  );
}
