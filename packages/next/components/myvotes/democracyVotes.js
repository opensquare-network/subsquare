import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VotesList from "./votesList";
import MobileVotesList from "./mobile/votesList";

export default function DemocracyVotes({ votes }) {
  const { width } = useWindowSize();

  return width > 1024 ? (
    <ListCard>
      <VotesList votes={votes} isGov2={false} />
    </ListCard>
  ) : (
    <MobileVotesList votes={votes} isGov2={true} />
  );
}
