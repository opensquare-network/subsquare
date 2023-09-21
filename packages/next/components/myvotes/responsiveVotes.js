import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VotesList from "./votesList";
import MobileVotesList from "./mobile/votesList";
import isNil from "lodash.isnil";
import ProxyHint from "./proxyHint";

export default function ResponsiveVotes({ votes, isLoading }) {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? (
    <ListCard>
      <ProxyHint style={{ marginBottom: 24 }} />
      <VotesList votes={votes} isLoading={isLoading} />
    </ListCard>
  ) : (
    <MobileVotesList votes={votes} isLoading={isLoading} />
  );
}
