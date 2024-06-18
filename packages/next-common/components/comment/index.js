import CommentItem from "./item";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import CommentListTemplate from "./commentListTemplate";

export default function Comments({ data, loading }) {
  return (
    <CommentListTemplate
      data={data}
      loading={loading}
      renderCommentItem={(item) =>
        item.comment_source === "polkassembly" ? (
          <PolkassemblyCommentItem key={item.id} data={item} />
        ) : (
          <CommentItem key={item._id} data={item} replyToCommentId={item._id} />
        )
      }
    />
  );
}
