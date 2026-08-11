import { useAsync } from "react-use";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";

export default function useSwapPreflight() {
  const papi = useAssetHubPapi();

  const { value: existentialDeposit = null } = useAsync(async () => {
    if (!papi) {
      return null;
    }

    try {
      return await papi.constants.Balances.ExistentialDeposit();
    } catch (error) {
      console.error("Failed to load swap preflight state", error);
      return null;
    }
  }, [papi]);

  return existentialDeposit;
}
