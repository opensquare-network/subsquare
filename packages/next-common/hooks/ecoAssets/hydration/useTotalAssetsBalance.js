import useAssetsTotal from "./useAssetsTotal";
import useFarmTotal from "./useFarmTotal";
import useLPTotal from "./useLPTotal";

export default async function useTotalAssetsBalance() {
  const address = "158svTMgfWrejQGjt3NNa1Pvhgm8ngMj5cn912Gwr47RoUK7";
  const { balance, isLoading } = useAssetsTotal(address);
  const { balance: lpBalance, isLoading: lpIsLoading } = useLPTotal(address);
  const { balance: farmBalance, isLoading: farmIsLoading } = useFarmTotal(address);
  console.log("::::farmBalance", farmBalance, farmIsLoading);

  console.log("::::balance", balance, isLoading);
  console.log("::::lpBalance", lpBalance, lpIsLoading);
  // return { balance, isLoading };
}
