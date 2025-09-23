import useAssetsTotal from "./useAssetsTotal";
import useLPTotal from "./useLPTotal";
import useFarmTotal from "./useFarmTotal";

export default async function useTotalAssetsBalance() {
  const address = "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4";
  const { balance, isLoading } = useAssetsTotal(address);
  // const lpBalance = useLPTotal(address);
  // const { balance: farmBalance, isLoading: farmIsLoading } = useFarmTotal(address);
  // console.log("::::farmBalance", farmBalance, farmIsLoading);

  console.log("::::balance", balance, isLoading);
  // console.log("::::lpBalance", lpBalance);
  // return { balance, isLoading };
}
