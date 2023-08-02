import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VotesList from "./votesList";

export default function OpenGovVotes({ votes }) {
  const { width } = useWindowSize();

  return (
    <>
      {width > 1024 ? (
        <ListCard>
          <VotesList votes={votes} isGov2={true} />
        </ListCard>
      ) : null}
    </>
  );
}
