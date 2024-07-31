import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { cn } from "next-common/utils";
import Loading from "../loading";
import { noop } from "lodash-es";

export default function CommentListTemplate({
  data: commentsData,
  loading,
  renderCommentItem = noop,
}) {
  const { items } = commentsData || {};

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center py-5">
        <Loading size={14} />
      </div>
    );
  } else if (items?.length > 0) {
    content = <div>{(items || []).map((item) => renderCommentItem(item))}</div>;
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
    </div>
  );
}
