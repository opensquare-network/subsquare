import styled, { css } from "styled-components";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import Flex from "next-common/components/styled/flex";
import { useIsMountedBool } from "next-common/utils/hooks/useIsMounted";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { useChain } from "next-common/context/chain";
import { noop } from "lodash-es";
import Editor from "next-common/components/editor";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";

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

function SimaCommentEditor(
  {
    postCid,
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
  const isMounted = useIsMountedBool();
  const signSimaMessage = useSignSimaMessage();

  const createCommentReply = useCallback(async () => {
    const entity = {
      action: "comment",
      cid: commentCid,
      ...getContentField(content, contentType),
      timestamp: Date.now(),
    };
    const data = await signSimaMessage(entity);
    return await nextApi.post(`sima/comments/${commentCid}/replies`, data);
  }, [commentCid, content, contentType, signSimaMessage]);

  const createPostComment = useCallback(async () => {
    const entity = {
      action: "comment",
      cid: postCid,
      ...getContentField(content, contentType),
      timestamp: Date.now(),
    };
    const data = await signSimaMessage(entity);
    return await nextApi.post(`sima/discussions/${postCid}/comments`, data);
  }, [postCid, content, contentType, signSimaMessage]);

  const createComment = async () => {
    if (!isMounted()) {
      return;
    }

    setLoading(true);
    try {
      let result;

      if (commentCid) {
        result = await createCommentReply();
      } else {
        result = await createPostComment();
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
