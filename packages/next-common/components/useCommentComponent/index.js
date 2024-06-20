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
import SimaComments from "../sima/comment";
import useSimaMentionList from "next-common/utils/sima/useSimaMentionList";

function SimaCommentComponent({
  user,
  postCid,
  editorWrapperRef,
  setQuillRef,
  contentType,
  setContentType,
  content,
  setContent,
  commentsData,
  loading,
}) {
  const post = usePost();
  const { ensureConnect } = useEnsureLogin();
  const users = useSimaMentionList(post, commentsData);

  let editor = (
    <div className="flex justify-end mt-4">
      <PrimaryButton
        onClick={() => {
          ensureConnect();
        }}
      >
        Connect
      </PrimaryButton>
    </div>
  );

  if (user) {
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
  }

  return (
    <div>
      <SimaComments data={commentsData} loading={loading} />
      {editor}
    </div>
  );
}

function CommentComponent({
  user,
  editorWrapperRef,
  setQuillRef,
  contentType,
  setContentType,
  content,
  setContent,
  postId,
  commentsData,
  loading,
}) {
  const post = usePost();
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

  return (
    <div>
      <Comments data={commentsData} loading={loading} />
      {editor}
    </div>
  );
}

export default function useCommentComponent() {
  const user = useUser();
  const post = usePost();
  const postId = post._id;
  const { commentsData, loading } = usePostCommentsData();

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const isSima = post.dataSource === "sima";
  const postCid = post.cid;

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  if (isSima) {
    const component = (
      <SimaCommentComponent
        user={user}
        postCid={postCid}
        editorWrapperRef={editorWrapperRef}
        setQuillRef={setQuillRef}
        contentType={contentType}
        setContentType={setContentType}
        content={content}
        setContent={setContent}
        commentsData={commentsData}
        loading={loading}
      />
    );

    return {
      component,
      focusEditor,
    };
  }

  const component = (
    <CommentComponent
      user={user}
      editorWrapperRef={editorWrapperRef}
      setQuillRef={setQuillRef}
      contentType={contentType}
      setContentType={setContentType}
      content={content}
      setContent={setContent}
      postId={postId}
      commentsData={commentsData}
      loading={loading}
    />
  );

  return {
    component,
    focusEditor,
  };
}
