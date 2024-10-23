import styled, { css } from "styled-components";
import React, { useState } from "react";
import { useRouter } from "next/router";
import ErrorText from "next-common/components/ErrorText";
import Flex from "next-common/components/styled/flex";
import { useMountedState } from "react-use";
import IdentityOrAddr from "../IdentityOrAddr";
import SplitCommentButton from "../splitCommentButton";
import SecondaryButton from "next-common/lib/button/secondary";
import { useChain } from "../../context/chain";
import { noop } from "lodash-es";
import Editor from "../editor";
import { usePost } from "next-common/context/post";
import { useCommentActions } from "next-common/sima/context/commentActions";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import Tooltip from "../tooltip";

const Wrapper = styled.div`
  margin-top: 48px;
  ${(p) =>
    (p.isEdit || p.isReply) &&
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

function CommentEditor(
  {
    isEdit,
    isReply,
    onFinishedEdit = noop,
    commentId,
    comment,
    content,
    setContent,
    contentType,
    setContentType,
    setQuillRef = () => {},
    users = [],
  },
  ref,
) {
  const dispatch = useDispatch();
  const post = usePost();
  const chain = useChain();
  const router = useRouter();
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const isMounted = useMountedState();
  const {
    createPostComment,
    createCommentReply,
    updateComment,
    createPostProxyComment,
  } = useCommentActions();

  const createComment = async (realAddress) => {
    if (!isMounted()) {
      return;
    }

    setLoading(true);
    try {
      let result;

      if (comment) {
        result = await createCommentReply(post, comment, content, contentType);
      } else if (realAddress) {
        result = await createPostProxyComment(
          realAddress,
          post,
          content,
          contentType,
        );
      } else {
        result = await createPostComment(post, content, contentType);
      }

      if (!isMounted()) {
        return;
      }

      if (result.error) {
        setErrors(result.error);
      } else {
        setContent("");
        if (isReply) {
          onFinishedEdit(true);
        } else {
          await router.replace(router.asPath);
          setTimeout(() => {
            if (isMounted()) {
              window && window.scrollTo(0, document.body.scrollHeight);
            }
          }, 4);
        }
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  };

  const editComment = async () => {
    setLoading(true);
    const { result, error } = await updateComment(
      commentId,
      content,
      contentType,
    );

    if (!isMounted()) {
      return;
    }

    setLoading(false);
    if (error) {
      setErrors(error);
    } else if (result) {
      onFinishedEdit(true);
    }
  };

  const isEmpty = content === "" || content === "<p><br></p>";

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
    <Wrapper isEdit={isEdit} isReply={isReply}>
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
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {(isEdit || isReply) && (
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
          <SplitCommentButton
            action={isEdit ? "Update" : isReply ? "Reply" : "Comment"}
            loading={loading}
            disabled={isEmpty}
            onClickComment={() => (isEdit ? editComment() : createComment())}
            onClickCommentAsProxy={(realAddress) => {
              createComment(realAddress);
            }}
          />
        </Tooltip>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default React.forwardRef(CommentEditor);
