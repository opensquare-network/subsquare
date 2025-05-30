import CommentItem from "./item";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { cn } from "next-common/utils";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import CommentsFilter from "./filter";
import { Skeleton } from "../skeleton";
import Divider from "../styled/layout/divider";

const CommentSkeleton = () => {
  const item = (
    <>
      <div className="py-4">
        <div className="flex gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <div className="flex justify-between flex-1">
            <Skeleton className="w-20 h-5 rounded-[4px]" />
            <Skeleton className="w-20 h-5 rounded-[4px]" />
          </div>
        </div>
        <div className="pl-7 pt-4 space-y-2">
          <Skeleton className="w-full h-5 rounded-[4px]" />
          <Skeleton className="w-full h-5 rounded-[4px]" />
          <Skeleton className="w-20 h-5 rounded-[4px]" />
        </div>
      </div>
      <div className="pl-7">
        <Divider height={2} className="h-[2px]" />
      </div>
    </>
  );

  return (
    <>
      {item}
      {item}
    </>
  );
};

export default function Comments({ data: commentsData, loading }) {
  const { items } = commentsData;

  let content;
  if (loading) {
    content = <CommentSkeleton />;
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
