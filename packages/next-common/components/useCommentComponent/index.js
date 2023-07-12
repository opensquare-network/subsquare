import { useRef, useState } from "react";
import Comments from "next-common/components/comment/index";
import Editor from "next-common/components/comment/editor";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor } from "next-common/utils/post";
import { useUser } from "../../context/user";

export default function useCommentComponent({ detail, comments, tabs = null }) {
  const loginUser = useUser();
  const postId = detail._id;

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown",
  );

  const users = useMentionList(detail, comments);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const CommentComponent = (
    <div>
      <Comments data={comments} tabs={tabs} />
      {loginUser && (
        <Editor
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
