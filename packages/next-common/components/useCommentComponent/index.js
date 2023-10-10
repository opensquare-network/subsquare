import { useRef, useState } from "react";
import Comments from "next-common/components/comment/index";
import CommentEditor from "next-common/components/comment/editor";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor } from "next-common/utils/post";
import { useUser } from "../../context/user";
import { usePostCommentsData } from "next-common/hooks/usePostComments";
import { usePost } from "next-common/context/post";

export default function useCommentComponent() {
  const loginUser = useUser();
  const post = usePost();
  const postId = post._id;
  const { commentsData } = usePostCommentsData();

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown",
  );

  const users = useMentionList(post, commentsData);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const CommentComponent = (
    <div>
      <Comments data={commentsData} />
      {loginUser && (
        <CommentEditor
          postId={postId}
          ref={editorWrapperRef}
          setQuillRef={setQuillRef}
          {...{
            contentType,
            setContentType,
            content,
            setContent,
            users,
          }}
        />
      )}
    </div>
  );

  return { CommentComponent, focusEditor };
}
