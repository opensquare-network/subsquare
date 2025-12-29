import CuratorChart from "./curatorChart";
import HorizontalTabs from "./horizontalTabs";

export default function BountyStatistics() {
  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <CuratorChart />
      </div>
      <HorizontalTabs />
    </div>
  );
}
