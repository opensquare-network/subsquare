import useAssetsTotal from "./useAssetsTotal";
import useLPTotal from "./useLPTotal";
// import useFarmTotal from "./useFarmTotal";

export default async function useTotalAssetsBalance() {
  const address = "7L53bUTBopuwFt3mKUfmkzgGLayYa1Yvn1hAg9v5UMrQzTfh";
  // const { balance, isLoading } = useAssetsTotal(address);
  const lpBalance = useLPTotal(address);
  // const { balance: farmBalance, isLoading: farmIsLoading } = useFarmTotal(address);

  // console.log("::::balance", balance, isLoading);
  // console.log("::::lpBalance", lpBalance);
  // return { balance, isLoading };
}
