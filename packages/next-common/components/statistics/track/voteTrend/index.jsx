import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useState } from "react";
import { StatisticsTitle } from "../../styled";
import DelegatedCheckBox from "../delegatedCheckBox";
import VoteTrendChart from "./voteTrendChart";

export default function TrackVoteTrend({ turnout }) {
  const [delegatedChecked, setDelegatedChecked] = useState(true);

  return (
    <SecondaryCard className="max-sm:!rounded-none">
      <StatisticsTitle className="flex justify-between items-center">
        Vote Trend
        <DelegatedCheckBox
          checked={delegatedChecked}
          setChecked={setDelegatedChecked}
        />
      </StatisticsTitle>
      <VoteTrendChart turnout={turnout} delegated={delegatedChecked} />
    </SecondaryCard>
  );
}
