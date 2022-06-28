import styled, { css } from "styled-components";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Button from "next-common/components/button";
import nextApi from "../../services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import Relative from "next-common/components/styled/relative";
import Flex from "next-common/components/styled/flex";
import { toApiType } from "../../utils/viewfuncs";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import dynamic from 'next/dynamic'
const UniverseEditor = dynamic(() => import("@osn/rich-text-editor").then(mod=> mod.UniverseEditor),{ssr:false})

const Wrapper = styled.div`
  margin-top: 48px;
  ${(p) =>
    p.isEdit &&
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

function Editor(
  {
    postId,
    isEdit,
    onFinishedEdit,
    commentId,
    chain,
    content,
    setContent,
    contentType,
    setContentType,
    setQuillRef = null,
    users = [],
    type,
  },
  ref
) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMountedBool();

  const createComment = async () => {
    if (!isMounted()) {
      return;
    }

    try {
      setLoading(true);
      const result = await nextApi.post(
        `${toApiType(type)}/${postId}/comments`,
        {
          content,
          contentType,
        },
        { credentials: "include" }
      );

      if (!isMounted()) {
        return;
      }

      if (result.error) {
        setErrors(result.error);
      } else {
        setShowPreview(false);
        setContent("");
        await router.replace(`[id]`, {
          pathname: `${router.query.id}`,
        });
        setTimeout(() => {
          if (isMounted()) {
            window && window.scrollTo(0, document.body.scrollHeight);
          }
        }, 4);
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
      content,
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

  const isEmpty = content === "" || content === `<p><br></p>`;

  return (
    <Wrapper>
      <Relative ref={ref}>
        <UniverseEditor
          value={content}
          onChange={setContent}
          contentType={contentType}
          setContentType={setContentType}
          loadSuggestions={()=> []}
          minHeight={100}
        />
      </Relative>
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {!isEdit && (
          <Button onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Edit" : "Preview"}
          </Button>
        )}
        {isEdit && (
          <Button onClick={() => onFinishedEdit(false)}>Cancel</Button>
        )}
        <Button
          isLoading={loading}
          secondary
          onClick={isEdit ? updateComment : createComment}
          disabled={isEmpty}
          title={isEmpty ? "cannot submit empty content" : ""}
        >
          {isEdit ? "Update" : "Comment"}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default React.forwardRef(Editor);
