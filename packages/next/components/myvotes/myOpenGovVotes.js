import ReferendaSummary from "./summary/referendaSummary";
import useFetchMyReferendaVoting from "./referenda/useFetchMyReferendaVoting";
import useSubClassLocks from "./referenda/useSubClassLocks";
import useFetchReferendaLockingPeriod from "./referenda/useFetchReferendaLockingPeriod";
import MyReferendaVotes from "./referenda/votes";

export default function MyOpenGovVotes() {
  useFetchMyReferendaVoting();
  useSubClassLocks();
  useFetchReferendaLockingPeriod();

  return (
    <div className="flex flex-col gap-[16px]">
      <ReferendaSummary />
      <MyReferendaVotes />
    </div>
  );
}
