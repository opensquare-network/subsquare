import TodoTag from "./todoTag";
import { useMyUnVotedReferenda } from "../context/hooks/votes";

export default function MyReferendaVotesTodo() {
  const myUnVotedReferenda = useMyUnVotedReferenda();

  if (!myUnVotedReferenda?.length) {
    return null;
  }

  return (
    <div className="flex items-center">
      <TodoTag>Referenda</TodoTag>
      <div className="text-textPrimary text14Medium">
        You have&nbsp;
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship?unvoted=true"
        >
          {myUnVotedReferenda.length} unvoted
        </a>
        &nbsp;referenda.
      </div>
    </div>
  );
}
