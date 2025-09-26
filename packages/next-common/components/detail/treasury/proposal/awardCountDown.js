import { useOnchainData } from "next-common/context/post";
import { TreasuryApprovalsProvider } from "next-common/context/treasury/approvals";
import useAwardCountDown from "next-common/hooks/treasury/proposal/useAwardCountDown";

export default function TreasuryAwardCountDown() {
  const { proposalIndex } = useOnchainData();

  return (
    <TreasuryApprovalsProvider>
      <TreasuryAwardCountDownImpl proposalIndex={proposalIndex} />
    </TreasuryApprovalsProvider>
  );
}

export function TreasuryAwardCountDownImpl({ proposalIndex, showText = true }) {
  const { component } = useAwardCountDown({
    proposalIndex,
    showText,
  });

  return component;
}
