import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import PostEdit from "next-common/components/post/postEdit";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import DetailHeader from "next-common/components/detail/detailHeader";
import ArticleContent from "./articleContent";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";

function DetailItem() {
  const post = usePost();
  const isEdit = useSelector(isEditingPostSelector);
  const setIsEdit = useSetEdit();

  if (!post) {
    return null;
  }

  if (isEdit) {
    return <PostEdit setIsEdit={setIsEdit} />;
  }

  return (
    <DetailContentBase>
      <DetailHeader />
      <ArticleContent setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}

export default function ApplicationDetail() {
  return (
    <ContentWithComment>
      <DetailItem />
    </ContentWithComment>
  );
}
