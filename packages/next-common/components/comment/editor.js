import styled, { css } from "styled-components";
import React, { useState } from "react";
import { useRouter } from "next/router";
import nextApi from "../../services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import Flex from "next-common/components/styled/flex";
import { prettyHTML, toApiType } from "../../utils/viewfuncs";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import IdentityOrAddr from "../IdentityOrAddr";
import PrimaryButton from "../buttons/primaryButton";
import GhostButton from "../buttons/ghostButton";
import { useChain } from "../../context/chain";
import { useDetailType } from "../../context/page";
import { noop } from "lodash-es";
import Editor from "../editor";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

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
    postId,
    isEdit,
    isReply,
    onFinishedEdit = noop,
    commentId,
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
  const type = useDetailType();
  const router = useRouter();
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMountedBool();
  const { ensureLogin } = useEnsureLogin();

  const createComment = async () => {
    if (!isMounted()) {
      return;
    }

    setLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const url = commentId
        ? `${toApiType(type)}/${postId}/comments/${commentId}/replies`
        : `${toApiType(type)}/${postId}/comments`;

      const result = await nextApi.post(
        url,
        {
          content: contentType === "html" ? prettyHTML(content) : content,
          contentType,
        },
        { credentials: "include" },
      );

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

  const updateComment = async () => {
    setLoading(true);
    const { result, error } = await nextApi.patch(`comments/${commentId}`, {
      content: contentType === "html" ? prettyHTML(content) : content,
      contentType,
    });

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
          <GhostButton
            onClick={() => {
              setContent("");
              onFinishedEdit(false);
            }}
          >
            Cancel
          </GhostButton>
        )}
        <PrimaryButton
          isLoading={loading}
          onClick={isEdit ? updateComment : createComment}
          disabled={isEmpty}
          title={isEmpty ? "cannot submit empty content" : ""}
        >
          {isEdit ? "Update" : isReply ? "Reply" : "Comment"}
        </PrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default React.forwardRef(CommentEditor);
