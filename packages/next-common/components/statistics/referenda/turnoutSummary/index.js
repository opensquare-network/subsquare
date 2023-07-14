import { StatisticsTitle } from "../../styled";
import TurnoutChart from "./turnoutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function OpenGovTurnoutSummary({ summary }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Average Turnout Pct.</StatisticsTitle>
      {/* NOTE: minus the padding manually, didn't found the way from chartjs docs */}
      <div className="-mt-[17px]">
        <TurnoutChart turnouts={summary?.trackTurnouts} />
      </div>
    </SecondaryCard>
  );
}
