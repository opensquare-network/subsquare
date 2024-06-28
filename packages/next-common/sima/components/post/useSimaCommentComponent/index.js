import { useRef, useState } from "react";
import SimaCommentEditor from "next-common/sima/components/comment/editor";
import { getFocusEditor } from "next-common/utils/post";
import { usePost } from "next-common/context/post";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import PrimaryButton from "next-common/lib/button/primary";
import SimaComments from "next-common/sima/components/comment";
import useSimaMentionList from "next-common/utils/sima/useSimaMentionList";
import { useComments } from "next-common/context/post/comments";
import { useConnectedAccount } from "next-common/context/connectedAccount";

export default function useSimaCommentComponent() {
  const connectedAccount = useConnectedAccount();
  const post = usePost();
  const commentsData = useComments();

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");
  const postCid = post.cid;

  const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

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

  if (connectedAccount) {
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

  const component = (
    <div>
      <SimaComments data={commentsData} />
      {editor}
    </div>
  );

  return {
    component,
    focusEditor,
  };
}
