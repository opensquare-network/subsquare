import React, { useState } from "react";
import styled from "styled-components";
import Button from "next-common/components/button";
import ErrorText from "next-common/components/ErrorText";
import dynamic from 'next/dynamic'
const UniverseEditor = dynamic(() => import("@osn/rich-text-editor").then(mod=> mod.UniverseEditor),{ssr:false})

const Wrapper = styled.div`
  margin-top: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
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
  editContent,
  editContentType,
  onFinishedEdit,
  update,
  loading,
  setLoading,
  type,
}) {
  const [content, setContent] = useState(editContent);
  const [contentType, setContentType] = useState(editContentType);
  const [errors, setErrors] = useState();

  const isEmpty = content === "" || content === `<p><br></p>`;

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
      <InputWrapper>
        <UniverseEditor
          value={content}
          onChange={setContent}
          contentType={contentType}
          setContentType={setContentType}
          loadSuggestions={()=> []}
          minHeight={144}
        />
      </InputWrapper>
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {!loading && (
          <Button onClick={() => onFinishedEdit(false)}>Cancel</Button>
        )}
        <Button isLoading={loading} onClick={onUpdate} disabled={isEmpty} secondary >
          Update
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
