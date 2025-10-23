import Delegates from "./delegates";
import DvReferendaVotes from "./dvVotes";
import Influence from "./influence";

export default function CurrentCohort() {
  return (
    <>
      <Delegates />
      <DvReferendaVotes />
      <Influence />
    </>
  );
}
