import { useRouter } from "next/router";
import ClickableText from "./clickableText";
import TodoTag from "./todoTag";
import { useMyUnVotedReferenda } from "../context/hooks/votes";

export default function MyReferendaVotesTodo() {
  const router = useRouter();
  const myUnVotedReferenda = useMyUnVotedReferenda();

  if (!myUnVotedReferenda?.length) {
    return null;
  }

  return (
    <div className="flex items-center">
      <TodoTag>Referenda</TodoTag>
      <div className="text-textPrimary text14Medium">
        You have&nbsp;
        <ClickableText onClick={() => router.push("/fellowship?unvoted=true")}>
          {myUnVotedReferenda.length} unvoted
        </ClickableText>
        &nbsp;referenda.
      </div>
    </div>
  );
}
