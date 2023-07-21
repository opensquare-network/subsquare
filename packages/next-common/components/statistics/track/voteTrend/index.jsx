import { useState } from "react";
import { StatisticsTitle } from "../../styled";
import DelegatedCheckBox from "../delegatedCheckBox";
import VoteTrendChart from "./voteTrendChart";
import ChartCard from "next-common/components/styled/containers/chartCard";

export default function VoteTrend({ turnout }) {
  const [delegatedChecked, setDelegatedChecked] = useState(true);

  const titleExtra = (
    <DelegatedCheckBox
      checked={delegatedChecked}
      setChecked={setDelegatedChecked}
    />
  );

  return (
    <ChartCard
      className="max-sm:!rounded-none"
      enlargable
      title={<StatisticsTitle className="mb-0">Vote Trend</StatisticsTitle>}
      titleExtra={titleExtra}
      popupHeadExtra={titleExtra}
      chart={<VoteTrendChart turnout={turnout} delegated={delegatedChecked} />}
      popupChart={
        <VoteTrendChart
          height={382}
          turnout={turnout}
          delegated={delegatedChecked}
        />
      }
    />
  );
}
