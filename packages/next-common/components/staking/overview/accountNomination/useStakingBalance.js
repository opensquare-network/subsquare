import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import { useActiveEra } from "next-common/context/staking/activeEra";

export default function useStakingBalance() {
  const { ledger, loading: loadingLedger } = useMyStakingLedger();
  const { activeEraIndex, loading: loadingCurrentEra } = useActiveEra();

  const loading = loadingLedger || loadingCurrentEra;
  if (loading) {
    return {
      loading: true,
      total: 0n,
      active: 0n,
      unlocking: 0n,
      unlocked: 0n,
    };
  }

  const total = BigInt(ledger?.total || 0);
  const active = BigInt(ledger?.active || 0);
  const unlockingEntries = (ledger?.unlocking || []).filter(
    (item) => item.era > activeEraIndex,
  );
  const unlocking = unlockingEntries.reduce((sum, item) => {
    return sum + BigInt(item.value || 0);
  }, 0n);
  const unlocked = total - active - unlocking;

  return { loading, total, active, unlocking, unlocked, unlockingEntries };
}
