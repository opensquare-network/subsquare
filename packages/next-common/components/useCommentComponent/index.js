import React, { useRef, useState } from "react";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import Comments from "next-common/components/comment/index";
import Editor from "next-common/components/comment/editor";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor, getOnReply } from "next-common/utils/post";

export default function useCommentComponent({
  detail,
  comments,
  loginUser,
  chain,
  type,
  tabs = null,
}) {
  const postId = detail._id;

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );

  const users = useMentionList(detail, comments, chain);

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

  const onReply = getOnReply(
    contentType,
    content,
    setContent,
    quillRef,
    focusEditor,
    chain
  );

  const CommentComponent = (
    <CommentsWrapper>
      <Comments
        data={comments}
        user={loginUser}
        chain={chain}
        onReply={onReply}
        tabs={tabs}
      />
      {loginUser && (
        <Editor
          postId={postId}
          chain={chain}
          ref={editorWrapperRef}
          setQuillRef={setQuillRef}
          {...{
            contentType,
            setContentType,
            content,
            setContent,
            users,
          }}
          type={type}
        />
      )}
    </CommentsWrapper>
  );

  return { CommentComponent, focusEditor, onReply };
}
