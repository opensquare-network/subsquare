import { useSelector } from "react-redux";
import DemocracySummary from "./summary/democracySummary";
import useSubMyDemocracyVoting from "./democracy/useSubMyDemocracyVoting";
import useFetchDemocracyLockingPeriod from "./democracy/useFetchDemocracyLockingPeriod";
import { isMyDemocracyDelegatingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import MyDelegatedVotes from "./democracy/delegatedVotes";
import MyDemocracyVotesList from "./democracy/votes";

export default function MyDemocracyVotes() {
  useSubMyDemocracyVoting();
  useFetchDemocracyLockingPeriod();
  const isDelegating = useSelector(isMyDemocracyDelegatingSelector);

  return (
    <div className="flex flex-col gap-[16px]">
      <DemocracySummary />
      {isDelegating ? <MyDelegatedVotes /> : <MyDemocracyVotesList />}
    </div>
  );
}
