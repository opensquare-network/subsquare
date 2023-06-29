import { useOnchainData } from "next-common/context/post";
import usePercentageBarData from "./usePercentageBarData";
import PercentageBar from "next-common/components/percentageBar";
import { Tooltip } from "../../status/styled";
import PercentageTooltip from "./percentageTooltip";
import { useSelector } from "react-redux";
import { isLoadingVotesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import { useThemeSetting } from "next-common/context/theme";
import { VotesGroupLabel, VotesInfoLine } from "./styled";

export default function DelegationStatus() {
  const { referendumIndex } = useOnchainData();
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const theme = useThemeSetting();
  const {
    directCapital,
    delegatedCapital,
    directVotes,
    delegatedVotes,
    directCapitalPercentage,
    delegatedCapitalPercentage,
    directVotesPercentage,
    delegatedVotesPercentage,
  } = usePercentageBarData();

  let disabledBar = (
    <PercentageBar
      percent={ 50 }
      colorLeft={ theme.grey100Bg }
      colorRight={ theme.grey100Bg }
    />
  );

  let capitalBar = (
    <Tooltip
      content={
        <PercentageTooltip
          referendumIndex={ referendumIndex }
          directPercentage={ directCapitalPercentage }
          directAmount={ directCapital }
          delegatedPercentage={ delegatedCapitalPercentage }
          delegatedAmount={ delegatedCapital }
        />
      }
    >
      <PercentageBar
        percent={ directCapitalPercentage }
        colorLeft="rgba(15, 111, 255, 0.4)"
        colorRight="rgba(232, 31, 102, 0.4)"
      />
    </Tooltip>
  );

  let votesBar = (
    <Tooltip
      content={
        <PercentageTooltip
          referendumIndex={ referendumIndex }
          directPercentage={ directVotesPercentage }
          directAmount={ directVotes }
          delegatedPercentage={ delegatedVotesPercentage }
          delegatedAmount={ delegatedVotes }
        />
      }
    >
      <PercentageBar
        percent={ directVotesPercentage }
        colorLeft="rgba(255, 152, 0, 0.4)"
        colorRight="rgba(232, 31, 102, 0.4)"
      />
    </Tooltip>
  );

  if (isLoadingVotes) {
    capitalBar = disabledBar;
    votesBar = disabledBar;
  }

  return <>
    <VotesInfoLine>
      <VotesGroupLabel>Capital Pct.</VotesGroupLabel>
      {capitalBar}
    </VotesInfoLine>
    <VotesInfoLine>
      <VotesGroupLabel>Votes Pct.</VotesGroupLabel>
      {votesBar}
    </VotesInfoLine>
  </>;
}
