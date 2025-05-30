import CommentItem from "./item";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { cn } from "next-common/utils";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import CommentsFilter from "./filter";
import CommentSkeleton from "./commentSkeleton";

export default function Comments({ data: commentsData, loading }) {
  const { items } = commentsData;

  let content;
  if (loading) {
    content = (
      <>
        <CommentSkeleton />
        <CommentSkeleton />
      </>
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
              replyToComment={item}
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

          <CommentsFilter />
        </TitleContainer>
      </div>

      {content}
    </div>
  );
}
