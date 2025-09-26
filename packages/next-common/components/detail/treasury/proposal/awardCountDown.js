import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import { useTreasuryPallet } from "next-common/context/treasury";
import { TreasuryApprovalsProvider } from "next-common/context/treasury/approvals";
import useAwardCountDown from "next-common/hooks/treasury/proposal/useAwardCountDown";
import { useMemo } from "react";

export default function TreasuryAwardCountDown() {
  const { proposalIndex } = useOnchainData();

  return (
    <TreasuryApprovalsProvider>
      <TreasuryAwardCountDownImpl proposalIndex={proposalIndex} />
    </TreasuryApprovalsProvider>
  );
}

export function TreasuryAwardCountDownImpl({ proposalIndex, showText = true }) {
  const api = useContextApi();
  const pallet = useTreasuryPallet();

  const approvalsQuery = useMemo(() => {
    return api?.query?.[pallet]?.approvals;
  }, [api, pallet]);

  const { component } = useAwardCountDown({
    approvalsQuery,
    proposalIndex,
    showText,
  });

  return component;
}
