import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import MyOpenGovVotes from "./myOpenGovVotes";
import MyDemocracyVotes from "./myDemocracyVotes";

export default function ModuleVotes() {
  const isReferenda = useIsReferenda();
  return isReferenda ? <MyOpenGovVotes /> : <MyDemocracyVotes />;
}
