import { useOnchainData } from "next-common/context/post";
import SpendList from "./spendList";

export default function AllFundBountiesRequest() {
  const onchain = useOnchainData();
  return <SpendList spends={onchain?.allFundBounties} />;
}
