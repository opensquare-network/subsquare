import React, { useState } from "react";
import styled from "styled-components";
import ErrorText from "next-common/components/ErrorText";
import GhostButton from "./buttons/ghostButton";
import PrimaryButton from "./buttons/primaryButton";
import Editor from "./editor";

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

  const onUpdate = async () => {
    try {
      setLoading(true);
      const { result, error } = await update(content, contentType);
      if (error) {
        setErrors(error);
      } else if (result) {
        await onFinishedEdit(true, setLoading);
      }
    } catch (e) {
      if (e) {
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
          <GhostButton onClick={() => onFinishedEdit(false)}>
            Cancel
          </GhostButton>
        )}
        <PrimaryButton
          isLoading={loading}
          onClick={onUpdate}
          disabled={isEmpty}
        >
          Update
        </PrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
}
