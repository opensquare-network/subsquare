import { useRef, useState } from "react";
import Comments from "next-common/components/comment/index";
import CommentEditor from "next-common/components/comment/editor";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor } from "next-common/utils/post";
import { useUser } from "../../context/user";
import { usePost } from "next-common/context/post";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";

export default function useCommentComponent({ commentsData, loading }) {
  const user = useUser();
  const post = usePost();
  const postId = post._id;

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);
  const { ensureLogin } = useEnsureLogin();
  const users = useMentionList(post, commentsData);

  let editor = (
    <div className="flex justify-end mt-4">
      <PrimaryButton
        onClick={() => {
          ensureLogin();
        }}
      >
        Login
      </PrimaryButton>
    </div>
  );

  if (user) {
    editor = (
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
    );
  }

  const component = (
    <div>
      <Comments data={commentsData} loading={loading} />
      {editor}
    </div>
  );

  return {
    component,
    focusEditor,
  };
}
