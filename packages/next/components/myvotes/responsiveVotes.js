import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VotesList from "./votesList";
import MobileVotesList from "./mobile/votesList";
import isNil from "lodash.isnil";

export default function ResponsiveVotes({ votes, isLoading }) {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? (
    <ListCard>
      <VotesList votes={votes} isLoading={isLoading} />
    </ListCard>
  ) : (
    <MobileVotesList votes={votes} isLoading={isLoading} />
  );
}
