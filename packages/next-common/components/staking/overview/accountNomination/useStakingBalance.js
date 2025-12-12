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

  const unlocking = (ledger?.unlocking || []).reduce((sum, item) => {
    if (item.era > activeEraIndex) {
      return sum + BigInt(item.value || 0);
    }
    return sum;
  }, 0n);
  const unlocked = total - active - unlocking;

  return { loading, total, active, unlocking, unlocked };
}
