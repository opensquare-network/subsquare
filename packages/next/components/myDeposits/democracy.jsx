import useFetchMyDemocracyDeposits from "next-common/hooks/account/deposit/useFetchMyDemocracyDeposits";

export default function MyDemocracyDeposits() {
  useFetchMyDemocracyDeposits();

  return <div>democracy</div>;
}
