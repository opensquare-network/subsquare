import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { noop } from "lodash-es";
import ErrorText from "next-common/components/ErrorText";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import Editor from "next-common/components/editor";
import { usePost, usePostDispatch } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useArticleActions } from "next-common/sima/context/articleActions";
import { useAddDiscussionAppendant } from "next-common/sima/actions/appendant";

export default function AppendantEditor({ setIsAppend }) {
  const dispatch = useDispatch();
  const postDispatch = usePostDispatch();
  const post = usePost();
  const ref = useRef();
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");
  const [isAppending, setIsAppending] = useState(false);
  const [errors, setErrors] = useState();
  const signSimaMessage = useSignSimaMessage();
  const { reloadPost } = useArticleActions();
  const addAppendant = useAddDiscussionAppendant();

  const isEmpty = !content.trim();

  const submitAppendant = useCallback(async () => {
    setIsAppending(true);
    setErrors();

    try {
      const postCid = post?.refToPost?.cid || post?.cid;
      const { result, error } = await addAppendant(
        postCid,
        content,
        contentType,
      );
      if (result) {
        setIsAppend(false);
        await reloadPost();
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setIsAppending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setIsAppend,
    content,
    contentType,
    post,
    dispatch,
    postDispatch,
    signSimaMessage,
  ]);

  return (
    <>
      <Editor
        ref={ref}
        value={content}
        onChange={setContent}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={() => []}
        minHeight={100}
        identifier={<IdentityOrAddr />}
        setQuillRef={noop}
        previewerPlugins={[]}
      />
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <div className="flex justify-end gap-[16px]">
        {!isAppending && (
          <SecondaryButton
            onClick={() => {
              setIsAppend(false);
            }}
          >
            Cancel
          </SecondaryButton>
        )}
        <PrimaryButton
          loading={isAppending}
          onClick={submitAppendant}
          disabled={isEmpty}
          title={isEmpty ? "cannot submit empty content" : ""}
        >
          Append
        </PrimaryButton>
      </div>
    </>
  );
}
