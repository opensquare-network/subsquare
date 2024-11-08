import React, { useState } from "react";
import styled from "styled-components";
import ErrorText from "next-common/components/ErrorText";
import SecondaryButton from "next-common/lib/button/secondary";
import Editor from "./editor";
import MaybeProxyEditButton from "./maybeProxyEditButton";

const Wrapper = styled.div`
  margin-top: 8px;
`;

const ButtonWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;

  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function EditInput({
  isSima,
  updateAsProxyAddress,
  editContent = "",
  editContentType,
  onFinishedEdit,
  update,
  loading,
  setLoading,
}) {
  const [content, setContent] = useState(editContent);
  const [contentType, setContentType] = useState(editContentType);
  const [errors, setErrors] = useState();

  const isEmpty = content === "" || content === "<p><br></p>";

  const onUpdate = async (realAddress) => {
    setLoading(true);
    try {
      const { result, error } = await update(content, contentType, realAddress);
      if (error) {
        setErrors(error);
      } else if (result) {
        await onFinishedEdit(true, setLoading);
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        setErrors(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Editor
        value={content}
        onChange={setContent}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={() => []}
        minHeight={100}
        previewerPlugins={[]}
        setQuillRef={() => {}}
      />
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {!loading && (
          <SecondaryButton onClick={() => onFinishedEdit(false)}>
            Cancel
          </SecondaryButton>
        )}
        <MaybeProxyEditButton
          isSima={isSima}
          isProxy={!!updateAsProxyAddress}
          loading={loading}
          disabled={isEmpty}
          onClick={() => onUpdate(updateAsProxyAddress)}
        />
      </ButtonWrapper>
    </Wrapper>
  );
}
