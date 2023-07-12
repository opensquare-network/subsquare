import DetailContentBase from "../../common/detailBase";
import ArticleContent from "../../../articleContent";
import { usePost } from "../../../../context/post";
import useSetEdit from "../../common/hooks/useSetEdit";

export default function TipDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return (
    <DetailContentBase>
      <ArticleContent post={post} onReply={onReply} setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
