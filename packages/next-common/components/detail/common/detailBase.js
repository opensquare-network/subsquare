import { useDetailType } from "../../../context/page";
import { usePost, usePostDispatch } from "../../../context/post";
import { useCallback } from "react";
import PostEdit from "../../post/postEdit";
import fetchAndUpdatePost from "../../../context/post/update";
import MaliciousHead from "../maliciousHead";
import { useDispatch, useSelector } from "react-redux";
import {
  isEditingPostSelector,
  setEditingPost,
} from "../../../store/reducers/userSlice";

export default function DetailContentBase({ head, title, meta, children }) {
  const type = useDetailType();
  const postDispatch = usePostDispatch();

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
    return (
      <PostEdit
        setIsEdit={setIsEdit}
        updatePost={() => fetchAndUpdatePost(postDispatch, type, post._id)}
      />
    );
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
