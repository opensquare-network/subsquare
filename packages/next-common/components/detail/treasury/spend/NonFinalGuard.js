import useIsTreasurySpendFinished from "next-common/hooks/treasury/spend/useIsTreasurySpendFinished";

export default function NonFinalTreasurySpendGuard({ children }) {
  const isFinished = useIsTreasurySpendFinished();
  if (isFinished) {
    return null;
  } else {
    return children;
  }
}
