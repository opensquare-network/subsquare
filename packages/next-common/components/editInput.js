import React, { useState } from "react";
import styled from "styled-components";
import ErrorText from "next-common/components/ErrorText";
import { renderDisableNonAddressLink } from "../utils/viewfuncs";
import dynamic from "next/dynamic";
import GhostButton from "./buttons/ghostButton";
import SecondaryButton from "./buttons/secondaryButton";

const UniverseEditor = dynamic(
  () => import("@osn/rich-text-editor").then((mod) => mod.UniverseEditor),
  { ssr: false }
);

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
          loadSuggestions={() => []}
          minHeight={100}
          previewerPlugins={[
            {
              name: "disable-non-address-link",
              onRenderedHtml: renderDisableNonAddressLink,
            },
          ]}
          setQuillRef={() => {}}
        />
      </InputWrapper>
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {!loading && (
          <GhostButton onClick={() => onFinishedEdit(false)}>
            Cancel
          </GhostButton>
        )}
        <SecondaryButton
          isLoading={loading}
          onClick={onUpdate}
          disabled={isEmpty}
        >
          Update
        </SecondaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
}
