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
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { getCookieConnectedAccount } from "next-common/utils/getCookieConnectedAccount";
import { prettyHTML } from "next-common/utils/viewfuncs";
import Duration from "next-common/components/duration";

function AppendItem({ index, data }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <span className="text12Bold text-textPrimary">#{index + 1}</span>
        <span className="text12Medium text-textTertiary">
          <Duration time={data.createdAt} />
        </span>
      </div>
      <div>
        <span className="text15MediumContent text-textPrimary">
          {data.content}
        </span>
      </div>
    </div>
  );
}

export default function Appendant({ isAppend, setIsAppend }) {
  const dispatch = useDispatch();
  const postDispatch = usePostDispatch();
  const post = usePost();
  const ref = useRef();
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");
  const [isAppending, setIsAppending] = useState(false);
  const [errors, setErrors] = useState();
  const { ensureConnect } = useEnsureLogin();
  const signMessage = useSignMessage();
  const appendants = post.appendants || [];

  const isEmpty = !content.trim();

  const submitAppendant = useCallback(async () => {
    setIsAppending(true);
    setErrors();

    try {
      if (!(await ensureConnect())) {
        return;
      }

      const connectedAccount = getCookieConnectedAccount();

      const contentFormat = contentType === "html" ? "HTML" : "subsquare_md";

      const entity = {
        action: "append_discussion",
        content: contentType === "html" ? prettyHTML(content) : content,
        content_format: contentFormat,
        CID: post.cid,
        timestamp: Date.now(),
      };
      const address = connectedAccount.address;
      const signerWallet = connectedAccount.wallet;
      const signature = await signMessage(
        JSON.stringify(entity),
        address,
        signerWallet,
      );
      const data = {
        entity,
        address,
        signature,
        signerWallet,
      };

      const { result, error } = await nextApi.post(
        `sima/discussions/${post.cid}/appendants`,
        data,
      );
      if (result) {
        const { result: newPost } = await nextApi.fetch(
          `posts/${post.postUid}`,
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
  }, [setIsAppend, content, contentType, post, dispatch, postDispatch]);

  if (appendants.length === 0 && !isAppend) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[16px] mt-[16px] pt-[16px] border-t border-neutral300">
      <span className="text14Bold text-textPrimary">Appendant</span>
      <div className="flex flex-col gap-[16px]">
        {appendants.map((item, index) => (
          <AppendItem key={index} index={index} data={item} />
        ))}
      </div>
      {isAppend && (
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
      )}
    </div>
  );
}
