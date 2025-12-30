import { StatisticsDiv } from "next-common/components/statistics/referenda/proposalAddress/style";
import Divider from "next-common/components/styled/layout/divider";
import CuratorChart from "./curatorChart";
import CuratorVSOthersChart from "./curatorVSOthersChart";
import HorizontalTabs from "./horizontalTabs";

export default function BountyStatistics() {
  return (
    <StatisticsDiv className="flex flex-col">
      <div className="sm:flex">
        <CuratorVSOthersChart />
      </div>
      <Divider />
      <div className="sm:flex">
        <CuratorChart />
      </div>
      <Divider />
      <HorizontalTabs />
    </StatisticsDiv>
  );
}
