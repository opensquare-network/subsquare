import { usePost } from "next-common/context/post";
import SimaDiscussionArticleContent from "next-common/sima/components/post/detailItem/articleContent";
import { isLinkedToSimaDiscussion } from "next-common/sima/actions/common";
import ArticleContent from "next-common/components/articleContent";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { useArticleActions } from "next-common/sima/context/articleActions";

export default function MaybeSimaDiscussionArticleContent() {
  const { supportSima } = useArticleActions();
  const post = usePost();
  const setIsEdit = useSetEdit();

  return supportSima && isLinkedToSimaDiscussion(post) ? (
    <SimaDiscussionArticleContent className="mt-6" setIsEdit={setIsEdit} />
  ) : (
    <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
  );
}
