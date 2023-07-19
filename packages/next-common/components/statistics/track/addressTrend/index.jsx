import { useState } from "react";
import AddressTrendChart from "./addressTrendChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "../../styled";
import DelegatedCheckBox from "../delegatedCheckBox";

export default function TrackAddressTrend({ turnout }) {
  const [delegatedChecked, setDelegatedChecked] = useState(true);

  return (
    <SecondaryCard className="max-sm:!rounded-none">
      <StatisticsTitle className="flex justify-between items-center">
        Addr Trend
        <DelegatedCheckBox
          checked={delegatedChecked}
          setChecked={setDelegatedChecked}
        />
      </StatisticsTitle>

      <AddressTrendChart turnout={turnout} delegated={delegatedChecked} />
    </SecondaryCard>
  );
}
