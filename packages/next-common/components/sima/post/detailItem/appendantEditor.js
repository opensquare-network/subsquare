import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { noop } from "lodash-es";
import ErrorText from "next-common/components/ErrorText";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import Editor from "next-common/components/editor";
import {
  POST_UPDATE_ACTION,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";

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

  const isEmpty = !content.trim();

  const submitAppendant = useCallback(async () => {
    setIsAppending(true);
    setErrors();

    try {
      const entity = {
        action: "append_discussion",
        CID: post.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      const { result, error } = await nextApi.post(
        `sima/discussions/${post.cid}/appendants`,
        data,
      );
      if (result) {
        const { result: newPost } = await nextApi.fetch(
          `sima/discussions/${post.cid}`,
        );

        if (newPost) {
          postDispatch({
            type: POST_UPDATE_ACTION,
            post: newPost,
          });
        }

        setIsAppend(false);
      }
      if (error) {
        dispatch(newErrorToast(error.message));
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setIsAppending(false);
    }
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
