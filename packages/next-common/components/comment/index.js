import CommentItem from "./item";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import Loading from "../loading";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import CommentsFilterForm from "./filterForm";
import { useUser } from "next-common/context/user";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { cn } from "next-common/utils";
import PrimaryButton from "next-common/lib/button/primary";

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
        <TitleContainer className={cn("w-full !px-0")}>
          <div className="text14Bold">Comments</div>

          <CommentsFilterForm />
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
