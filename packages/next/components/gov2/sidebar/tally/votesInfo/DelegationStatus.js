import { useOnchainData } from "next-common/context/post";
import useTallyPercentageBarData from "../../../../../../next-common/hooks/referenda/useTallyPercentageBarData";
import PercentageBar from "next-common/components/percentageBar";
import { Tooltip } from "../../status/styled";
import PercentageTooltip from "./percentageTooltip";
import { VotesGroupLabel, VotesInfoLine } from "./styled";

export default function DelegationStatus() {
  const { referendumIndex } = useOnchainData();
  const {
    directCapital,
    delegatedCapital,
    directVotes,
    delegatedVotes,
    directCapitalPercentage,
    delegatedCapitalPercentage,
    directVotesPercentage,
    delegatedVotesPercentage,
  } = useTallyPercentageBarData();

  let capitalBar = (
    <Tooltip
      content={
        <PercentageTooltip
          referendumIndex={referendumIndex}
          directPercentage={directCapitalPercentage}
          directAmount={directCapital}
          delegatedPercentage={delegatedCapitalPercentage}
          delegatedAmount={delegatedCapital}
        />
      }
    >
      <PercentageBar
        percent={directCapitalPercentage}
        colorLeft="rgba(15, 111, 255, 0.4)"
        colorRight="rgba(232, 31, 102, 0.4)"
      />
    </Tooltip>
  );

  let votesBar = (
    <Tooltip
      content={
        <PercentageTooltip
          referendumIndex={referendumIndex}
          directPercentage={directVotesPercentage}
          directAmount={directVotes}
          delegatedPercentage={delegatedVotesPercentage}
          delegatedAmount={delegatedVotes}
        />
      }
    >
      <PercentageBar
        percent={directVotesPercentage}
        colorLeft="rgba(255, 152, 0, 0.4)"
        colorRight="rgba(232, 31, 102, 0.4)"
      />
    </Tooltip>
  );

  return (
    <>
      <VotesInfoLine>
        <VotesGroupLabel>Capital Pct.</VotesGroupLabel>
        {capitalBar}
      </VotesInfoLine>
      <VotesInfoLine>
        <VotesGroupLabel>Votes Pct.</VotesGroupLabel>
        {votesBar}
      </VotesInfoLine>
    </>
  );
}
