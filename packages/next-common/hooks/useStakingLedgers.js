import useSubStorage from "./common/useSubStorage";

export function useStakingLedgers(address) {
  const { result: ledger, loading: isLedgerLoading } = useSubStorage(
    "staking",
    "ledger",
    [address],
  );
  const { result: payee, loading: isPayeeLoading } = useSubStorage(
    "staking",
    "payee",
    [address],
  );
  const { result: nominators, loading: isNominatorsLoading } = useSubStorage(
    "staking",
    "nominators",
    [address],
  );

  const loading = isLedgerLoading || isPayeeLoading || isNominatorsLoading;

  return {
    ledger: ledger?.toJSON(),
    payee: payee?.toJSON(),
    nominators: nominators?.toJSON(),
    loading,
  };
}
