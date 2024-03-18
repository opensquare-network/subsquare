import CommentItem from "./item";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { useUser } from "../../context/user";
import { cn } from "next-common/utils";
import PrimaryButton from "next-common/lib/button/primary";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import Loading from "../loading";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

export default function Comments({ data: commentsData, loading }) {
  const { items } = commentsData;
  const user = useUser();
  const { ensureLogin } = useEnsureLogin();

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center py-5">
        <Loading size={14} />
      </div>
    );
  } else if (items?.length > 0) {
    content = (
      <div>
        {(items || []).map((item) =>
          item.comment_source === "polkassembly" ? (
            <PolkassemblyCommentItem key={item.id} data={item} />
          ) : (
            <CommentItem
              key={item._id}
              data={item}
              replyToCommentId={item._id}
            />
          ),
        )}
      </div>
    );
  } else {
    content = <NoComment />;
  }

  return (
    <div>
      <div className="mb-4">
        <TitleContainer className={cn("w-full !px-0 mb-4", "!block")}>
          <div className="text14Bold">Comments</div>
        </TitleContainer>
      </div>

      {content}

      {!user && (
        <div className="flex justify-end mt-4">
          <PrimaryButton onClick={() => ensureLogin()}>Login</PrimaryButton>
        </div>
      )}
    </div>
  );
}
