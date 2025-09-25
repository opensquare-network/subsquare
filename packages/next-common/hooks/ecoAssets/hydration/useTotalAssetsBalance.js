import useAssetsTotal from "./useAssetsTotal";
import useFarmTotal from "./useFarmTotal";
import useLPTotal from "./useLPTotal";
import useXykTotal from "./useXykTotal";

export default async function useTotalAssetsBalance() {
  const address = "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4";
  const { balance, isLoading } = useAssetsTotal(address);
  const { balance: lpBalance, isLoading: lpIsLoading } = useLPTotal(address);
  const { balance: farmBalance, isLoading: farmIsLoading } = useFarmTotal(address);
  const { balance: xykBalance, isLoading: xykIsLoading } = useXykTotal(address);

  // console.log("::::xykBalance", xykBalance, xykIsLoading);
  // console.log("::::balance", balance, isLoading);
  // console.log("::::farmBalance", farmBalance, farmIsLoading);
  // console.log("::::lpBalance", lpBalance, lpIsLoading);
  // return { balance, isLoading };
}
