import { useRouter } from "next/router";
import ClickableText from "./clickableText";
import TodoTag from "./todoTag";
import { useContextMyVotedReferenda } from "../context/myVotedReferenda";

export default function MyUnVotedReferendaTodo() {
  const router = useRouter();
  const { myVotedReferenda } = useContextMyVotedReferenda();

  if (!myVotedReferenda?.length) {
    return null;
  }

  return (
    <div className="flex items-center">
      <TodoTag>Referenda</TodoTag>
      <div className="text-textPrimary text14Medium">
        You have&nbsp;
        <ClickableText onClick={() => router.push("/fellowship?unvoted=true")}>
          {myVotedReferenda.length} unvoted
        </ClickableText>
        &nbsp;referenda.
      </div>
    </div>
  );
}
