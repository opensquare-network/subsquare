import CommentItem from "./item";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { cn } from "next-common/utils";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import Loading from "../loading";
import CommentsFilter from "./filter";

export default function Comments({ data: commentsData, loading }) {
  const { items } = commentsData;

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
