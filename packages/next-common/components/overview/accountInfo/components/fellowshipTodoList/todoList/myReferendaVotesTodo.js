import { useMemo } from "react";
import { difference } from "lodash-es";
import { useRouter } from "next/router";
import ClickableText from "./clickableText";
import TodoTag from "./todoTag";
import {
  useCollectiveActiveReferendaICanVote,
  useMyVotedCollectiveReferenda,
} from "../context/hooks/votes";

export default function MyReferendaVotesTodo() {
  const router = useRouter();
  const { myVotedReferenda } = useMyVotedCollectiveReferenda();
  const { referendaICanVote } = useCollectiveActiveReferendaICanVote();
  const myUnVotedReferenda = useMemo(
    () => difference(referendaICanVote, myVotedReferenda),
    [referendaICanVote, myVotedReferenda],
  );

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
