import CuratorChart from "./curatorChart";
import CuratorVSOthersChart from "./curatorVSOthersChart";
import HorizontalTabs from "./horizontalTabs";

export default function BountyStatistics() {
  return (
    <div className="space-y-4">
      <div className="sm:flex">
        <CuratorVSOthersChart />
      </div>

      <div className="sm:flex">
        <CuratorChart />
      </div>
      <HorizontalTabs />
    </div>
  );
}
