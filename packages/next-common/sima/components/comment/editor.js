import styled, { css } from "styled-components";
import React, { useState } from "react";
import { useRouter } from "next/router";
import ErrorText from "next-common/components/ErrorText";
import Flex from "next-common/components/styled/flex";
import { useMountedState } from "react-use";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { useChain } from "next-common/context/chain";
import { noop } from "lodash-es";
import Editor from "next-common/components/editor";
import { useCommentActions } from "next-common/sima/context/commentActions";
import { usePost } from "next-common/context/post";

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

function SimaCommentEditor(
  {
    commentCid,
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
  const chain = useChain();
  const router = useRouter();
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const isMounted = useMountedState();
  const post = usePost();

  const { createCommentReply, createPostComment } = useCommentActions();

  const createComment = async () => {
    if (!isMounted()) {
      return;
    }

    setLoading(true);
    try {
      let result;

      if (commentCid) {
        result = await createCommentReply(
          post,
          commentCid,
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
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  };

  const isEmpty = content === "" || content === "<p><br></p>";

  const loadSuggestions = (text) => {
    return (users || [])
      .map((user) => ({
        preview: user.name,
        value: `[@${user.name}](${user.value}-${chain}) `,
        address: user.value,
        isKeyRegistered: true,
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
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
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
        <PrimaryButton
          loading={loading}
          onClick={createComment}
          disabled={isEmpty}
          title={isEmpty ? "cannot submit empty content" : ""}
        >
          {isReply ? "Reply" : "Comment"}
        </PrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default React.forwardRef(SimaCommentEditor);
