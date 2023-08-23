import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { useSelector } from "react-redux";
import VotesStats from "../../charts/votesStats";

export default function Gov2ReferendaVotesStats() {
  const votes = useSelector(allVotesSelector);

  return <VotesStats votes={votes} />;
}
