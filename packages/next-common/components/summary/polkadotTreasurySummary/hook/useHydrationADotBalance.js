import { useHydrationCurrencyAccountData } from "next-common/hooks/useHydrationCurrencyInfo";

const ADOT_TOKEN_ID = 1001;

export default function useHydrationADotBalance(address) {
  const { value, loading } = useHydrationCurrencyAccountData(
    ADOT_TOKEN_ID,
    address,
  );
  return { value: value, isLoading: loading };
}
