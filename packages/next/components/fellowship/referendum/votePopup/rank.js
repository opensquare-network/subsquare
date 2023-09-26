import {
  StatusWrapper,
  WarningMessage,
} from "next-common/components/popup/styled";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useFellowshipRank from "next-common/utils/hooks/fellowship/useFellowshipRank";

export default function Rank() {
  const signerAccount = useSignerAccount();
  const { rank, isLoading } = useFellowshipRank(signerAccount?.realAddress);

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
