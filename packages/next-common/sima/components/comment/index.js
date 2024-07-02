import CommentItem from "./item";
import CommentListTemplate from "next-common/components/comment/commentListTemplate";

export default function SimaComments({ data, loading }) {
  return (
    <CommentListTemplate
      data={data}
      loading={loading}
      renderCommentItem={(item) => (
        <CommentItem key={item._id} data={item} replyToCommentCid={item.cid} />
      )}
    />
  );
}
