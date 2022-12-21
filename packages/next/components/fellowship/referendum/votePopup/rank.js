import {
  StatusWrapper,
  WarningMessage,
} from "next-common/components/popup/styled";
import useFellowshipRank from "next-common/utils/hooks/fellowship/useFellowshipRank";

export default function Rank() {
  const { rank, isLoading } = useFellowshipRank();

  if (isLoading) {
    return null;
  }

  if (!rank) {
    return (
      <WarningMessage danger>Only fellowship members can vote.</WarningMessage>
    );
  }

  return (
    <StatusWrapper>
      <div className="value">Rank</div>
      <div className="result">{rank.rank}</div>
    </StatusWrapper>
  );
}
