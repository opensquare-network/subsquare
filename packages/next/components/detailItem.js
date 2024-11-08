import { useState } from "react";
import PostEdit from "next-common/components/post/postEdit";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import DetailHeader from "next-common/components/detail/detailHeader";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";

export default function DetailItem() {
  const post = usePost();
  const [isEdit, setIsEdit] = useState(false);

  if (!post) {
    return null;
  }

  if (isEdit) {
    return <PostEdit setIsEdit={setIsEdit} />;
  }

  return (
    <DetailContentBase>
      <DetailHeader />
      <MaybeSimaDiscussionArticleContent />
    </DetailContentBase>
  );
}
