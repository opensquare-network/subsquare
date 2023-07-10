import { usePost } from "next-common/context/post";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import ArticleContent from "next-common/components/articleContent";

export default function DemocracyReferendaDetail({ onReply }) {
  const post = usePost();
  const setIsEdit = useSetEdit();

  return (
    <DetailContentBase>
      <ArticleContent post={post} onReply={onReply} setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
