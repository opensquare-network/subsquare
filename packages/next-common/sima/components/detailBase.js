import { usePost } from "next-common/context/post";
import { useCallback } from "react";
import MaliciousHead from "next-common/components/detail/maliciousHead";
import { useDispatch, useSelector } from "react-redux";
import {
  isEditingPostSelector,
  setEditingPost,
} from "next-common/store/reducers/userSlice";
import SimaPostEdit from "next-common/sima/components/post/postEdit";

export default function DetailContentBase({ head, title, meta, children }) {
  const isEditing = useSelector(isEditingPostSelector);
  const dispatch = useDispatch();
  const setIsEdit = useCallback(
    (editing) => {
      dispatch(setEditingPost(editing));
    },
    [dispatch],
  );

  const post = usePost();
  if (!post) {
    return null;
  }

  if (isEditing) {
    return <SimaPostEdit setIsEdit={setIsEdit} />;
  }

  return (
    <div>
      {post?.isMalicious && <MaliciousHead />}

      {head}

      {title}
      {title && meta && <div className="py-2" />}
      {meta}

      {children}
    </div>
  );
}
