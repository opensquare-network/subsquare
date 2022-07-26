import React, { useState, useRef } from "react";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import SourceTabs from "next-common/components/comment/sourceTabs";
import Comments from "next-common/components/comment";
import Editor from "next-common/components/comment/editor";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import useDarkMode from "next-common/utils/hooks/useDarkMode";

export default function useCommentComponent({
  detail,
  comments,
  loginUser,
  chain,
  type,
  tabIndex,
  setTabIndex,
}) {
  const [theme] = useDarkMode();
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

  let tabs = null;
  if (detail?.polkassemblyId) {
    // Allow to switch to polkassembly comments if has corresponding pa post
    tabs = (
      <div style={{ width: "240px", marginTop: "-6px" }}>
        <SourceTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
    );
  }

  const CommentComponent = (
    <CommentsWrapper theme={theme}>
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
