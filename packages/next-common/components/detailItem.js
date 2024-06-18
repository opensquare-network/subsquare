import { useState } from "react";
import ArticleContent from "next-common/components/articleContent";
import PostEdit from "next-common/components/post/postEdit";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useDetailType } from "next-common/context/page";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import DetailHeader from "next-common/components/detail/detailHeader";

export default function DetailItem() {
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const post = usePost();
  const [isEdit, setIsEdit] = useState(false);

  if (!post) {
    return null;
  }

  if (isEdit) {
    return (
      <PostEdit
        setIsEdit={setIsEdit}
        updatePost={() => fetchAndUpdatePost(postDispatch, type, post._id)}
      />
    );
  }

  return (
    <DetailContentBase>
      <DetailHeader />
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
