import { useRef, useState } from "react";
import Comments from "next-common/components/comment/index";
import CommentEditor from "next-common/components/comment/editor";
import useMentionList from "next-common/utils/hooks/useMentionList";
import { getFocusEditor } from "next-common/utils/post";
import { useUser } from "../../context/user";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";
import { useChainSettings } from "next-common/context/chain";

export default function useCommentComponent({ commentsData, loading }) {
  const user = useUser();
  const { sima } = useChainSettings();

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );

  // eslint-disable-next-line react-hooks/refs
  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);
  const { ensureLogin, ensureConnect } = useEnsureLogin();
  const users = useMentionList(commentsData);

  let editor = sima ? (
    <div className="flex justify-end mt-4">
      <PrimaryButton
        onClick={() => {
          ensureConnect();
        }}
      >
        Connect
      </PrimaryButton>
    </div>
  ) : (
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
