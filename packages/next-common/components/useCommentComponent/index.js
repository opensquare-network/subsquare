import { useRef, useState } from "react";
import Comments from "next-common/components/comment/index";
import CommentEditor from "next-common/components/comment/editor";
import SimaCommentEditor from "next-common/components/sima/comment/editor";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor } from "next-common/utils/post";
import { useUser } from "../../context/user";
import { usePostCommentsData } from "next-common/hooks/usePostComments";
import { usePost } from "next-common/context/post";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";

export default function useCommentComponent() {
  const user = useUser();
  const post = usePost();
  const postId = post._id;
  const { commentsData, loading } = usePostCommentsData();
  const { ensureLogin, ensureConnect } = useEnsureLogin();

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const isSima = post.dataSource === "sima";
  const postCid = post.cid;
  const users = useMentionList(post, commentsData);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  let editor = (
    <div className="flex justify-end mt-4">
      <PrimaryButton
        onClick={() => {
          if (isSima) {
            ensureConnect();
          } else {
            ensureLogin();
          }
        }}
      >
        {isSima ? "Connect" : "Login"}
      </PrimaryButton>
    </div>
  );

  if (user) {
    if (isSima) {
      editor = (
        <SimaCommentEditor
          postCid={postCid}
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
    } else {
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
  }

  const CommentComponent = (
    <div>
      <Comments data={commentsData} loading={loading} />
      {editor}
    </div>
  );

  return { CommentComponent, focusEditor };
}
