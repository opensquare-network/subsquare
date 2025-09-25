import styled, { css } from "styled-components";
import React from "react";
// import ErrorText from "next-common/components/ErrorText";
import Flex from "next-common/components/styled/flex";
import SecondaryButton from "next-common/lib/button/secondary";
import { noop } from "lodash-es";
import Editor from "../editor";
import IdentityOrAddr from "../IdentityOrAddr";
import Tooltip from "../tooltip";
import PrimaryButton from "next-common/lib/button/primary";
import { useChain } from "next-common/context/chain";
import nextApi from "next-common/services/nextApi";
import { usePost } from "next-common/context/post";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useRouter } from "next/router";
import { setLoading } from "next-common/store/reducers/referenda/votes";
import { useComment } from "../comment/context";

const Wrapper = styled.div`
  margin-top: 48px;
  ${(p) =>
    p.isReply &&
    css`
      margin-top: 8px;
    `}
`;

const ButtonWrapper = styled(Flex)`
  margin-top: 16px;
  justify-content: flex-end;

  > :not(:first-child) {
    margin-left: 12px;
  }
`;

function escapeLinkText(text) {
  return text.replace(/\\/g, "\\\\").replace(/([[\]])/g, "\\$1");
}

function PolkassemblyCommentReplyEditor(
  {
    isReply,
    onFinishedEdit = noop,
    content,
    setContent,
    contentType,
    setContentType,
    setQuillRef = () => {},
    users = [],
  },
  ref,
) {
  const comment = useComment();
  const router = useRouter();
  const dispatch = useDispatch();
  const post = usePost();
  const chain = useChain();
  // const [errors, setErrors] = useState();
  // const [loading, setLoading] = useState(false);
  const { ensureLogin } = useEnsureLogin();

  const isEmpty = content === "" || content === "<p><br></p>";

  const createReply = async () => {
    setLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const polkassemblyCommentId =
        comment?.polkassemblyCommentId || comment?.id;

      if (!polkassemblyCommentId) {
        dispatch(newErrorToast("Polkassembly comment id not found"));
        return;
      }

      const { result, error } = await nextApi.post(
        `polkassembly-comments/${post.polkassemblyPostType}/${post.polkassemblyId}/${polkassemblyCommentId}/replies`,
        {
          content,
          contentType,
        },
      );

      if (error) {
        dispatch(newErrorToast(error.message));
      }
      if (result) {
        setContent("");
        onFinishedEdit(false);
        router.replace(router.asPath);
      }
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = (text) => {
    return (users || [])
      .map((user) => ({
        preview: user.name,
        value: user.isKeyRegistered
          ? `[@${user.name}](${user.value}-${chain}) `
          : `[@${escapeLinkText(user.name)}](/user/${user.value}) `,
        address: user.value,
        isKeyRegistered: user.isKeyRegistered,
        chain: chain,
      }))
      .filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
  };

  return (
    <Wrapper isReply={isReply}>
      <Editor
        ref={ref}
        value={content}
        onChange={setContent}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={loadSuggestions}
        minHeight={100}
        identifier={<IdentityOrAddr />}
        setQuillRef={setQuillRef}
        previewerPlugins={[]}
      />
      {/* {errors?.message && <ErrorText>{errors?.message}</ErrorText>} */}
      <ButtonWrapper>
        {isReply && (
          <SecondaryButton
            onClick={() => {
              setContent("");
              onFinishedEdit(false);
            }}
          >
            Cancel
          </SecondaryButton>
        )}
        <Tooltip content={isEmpty ? "Cannot submit empty content" : ""}>
          <PrimaryButton
            // loading={loading}
            disabled={isEmpty}
            onClick={createReply}
          >
            Reply
          </PrimaryButton>
        </Tooltip>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default React.forwardRef(PolkassemblyCommentReplyEditor);
