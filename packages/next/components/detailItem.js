import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import PostEdit from "next-common/components/post/postEdit";
import { usePost } from "next-common/context/post";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import DetailHeader from "next-common/components/detail/detailHeader";

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
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
