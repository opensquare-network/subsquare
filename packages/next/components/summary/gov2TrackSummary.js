import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime } from "next-common/utils";
import { SummaryGreyText } from "next-common/components/summary/styled";
import Delegation from "./delegation";
import Summary from "next-common/components/summary/new";

export default function Gov2TrackSummary({ summary, period }) {
  const {
    origin,
    description,
    maxDeciding,
    preparePeriod,
    decisionPeriod,
    confirmPeriod,
    id,
  } = period ?? {};

  const blockTime = useSelector(blockTimeSelector);
  const preparePeriodBlockTime = estimateBlocksTime(preparePeriod, blockTime);
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);
  const confirmPeriodBlockTime = estimateBlocksTime(confirmPeriod, blockTime);

  return (
    <Summary
      title={`Origin: ${origin}`}
      titleExtra={`#${id}`}
      description={description}
      footer={<Delegation trackId={id} />}
      items={[
        {
          title: "Capacity",
          content: (
            <span>
              {summary.decidingCount || 0}
              <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
            </span>
          ),
        },
        {
          title: "Total",
          content: <span>{summary.total}</span>,
        },
        {
          title: "Prepare Period",
          content: (
            <span>
              {preparePeriodBlockTime[0] || 0}
              <SummaryGreyText> {preparePeriodBlockTime[1]}</SummaryGreyText>
            </span>
          ),
        },
        {
          title: "Confirm / Decision",
          content: (
            <>
              <span>
                <span>
                  {confirmPeriodBlockTime[0] || 0}
                  <SummaryGreyText>
                    {" "}
                    {confirmPeriodBlockTime[1]}
                  </SummaryGreyText>
                </span>

                <SummaryGreyText> / </SummaryGreyText>

                <span>
                  {decisionPeriodBlockTime[0] || 0}
                  <SummaryGreyText>
                    {" "}
                    {decisionPeriodBlockTime[1]}
                  </SummaryGreyText>
                </span>
              </span>
            </>
          ),
        },
      ]}
    />
  );
}
