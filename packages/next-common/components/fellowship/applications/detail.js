import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import PostEdit from "next-common/components/post/postEdit";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import DetailHeader from "next-common/components/detail/detailHeader";
import ArticleContent from "./articleContent";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";

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
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <ContentWithComment>
          <DetailItem />
        </ContentWithComment>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}
