import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { useMyUnVotedReferenda } from "../context/hooks/votes";

export default function MyReferendaVotesTodo() {
  const myUnVotedReferenda = useMyUnVotedReferenda();

  if (!myUnVotedReferenda?.length) {
    return null;
  }

  const isPlurality = (myUnVotedReferenda || []).length > 1;

  return (
    <TodoWrapper>
      <TodoTag>Referenda</TodoTag>
      <TodoContent>
        You have&nbsp;
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship?unvoted=true"
        >
          {myUnVotedReferenda.length} {isPlurality ? "referenda" : "referendum"}
        </a>
        &nbsp;to vote.
      </TodoContent>
    </TodoWrapper>
  );
}
