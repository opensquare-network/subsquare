import SummaryLayout from "next-common/components/summary/layout/layout";
import CurrentPrice from "./columns/currentPrice";
import AvailableCores from "./columns/availableCores";
import CurrentPhase from "./columns/currentPhase";
import TotalPeriod from "./columns/totalPeriod";
import Regions from "./columns/regions";

export default function CoretimeSaleSummary() {
  return (
    <div>
      <SummaryLayout>
        <CurrentPrice />
        <AvailableCores />
        <CurrentPhase />
        <TotalPeriod />
        <Regions />
      </SummaryLayout>
    </div>
  );
}
