import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Input from "next-common/lib/input";
import nextApi from "next-common/services/nextApi";
import { Label, LabelWrapper } from "next-common/components/post/styled";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ErrorText from "next-common/components/ErrorText";
import PrimaryButton from "next-common/lib/button/primary";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useUser } from "next-common/context/user";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Editor, { useEditorUploading } from "next-common/components/editor";
import { getContentField } from "next-common/utils/sima/utils";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import AdvancedForm from "next-common/components/post/advanced/form";

const Wrapper = styled(NeutralPanel)`
  color: var(--textPrimary);
  border: 0;
  box-shadow: none;
  textarea:read-only,
  div.ql-disabled {
    background-color: var(--neutral200) !important;
  }

  div + textarea {
    border-color: var(--neutral400);
  }
  input {
    color: var(--textPrimary);
  }

  @media screen and (max-width: 768px) {
    margin-left: -16px;
    margin-right: -16px;
    border-radius: 0;
    padding: 24px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 32px;

  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export default function SimaPostCreate() {
  const user = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [errors, setErrors] = useState();
  const signSimaMessage = useSignSimaMessage();
  const [editorUploading] = useEditorUploading();
  const advancedForm = useRef();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [formValue, setFormValue] = useState({});

  const createPost = async () => {
    setCreating(true);

    try {
      const entity = {
        action: "new_discussion",
        title,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);

      const { result, error } = await nextApi.post(
        "sima/discussions",
        {
          ...data,
          ...formValue,
        },
        { credentials: "include" },
      );
      if (error) {
        if (error.data) {
          setErrors(error);
        } else {
          dispatch(newErrorToast(error.message));
        }
      } else {
        const { postUid } = result;
        router.push(`/posts/${postUid}`);
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setCreating(false);
    }
  };

  const isEmpty = title === "" || content === "" || content === "<p><br></p>";

  const isDisableCreate = useMemo(() => {
    let result = true;
    const validatePass = isAdvanced
      ? advancedForm.current?.validateForm()
      : true;
    result = isEmpty || !validatePass || editorUploading;

    return result;
  }, [isEmpty, isAdvanced, editorUploading]);

  return (
    <Wrapper>
      <TitleContainer className="!px-0">New Post</TitleContainer>
      <LabelWrapper>
        <Label>Title</Label>
      </LabelWrapper>
      <Input
        disabled={creating}
        placeholder="Please fill the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {errors?.data?.title?.[0] && (
        <ErrorText>{errors?.data?.title?.[0]}</ErrorText>
      )}

      <LabelWrapper>
        <Label>Issue</Label>
      </LabelWrapper>

      <Editor
        value={content}
        onChange={setContent}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={() => []}
        minHeight={300}
        setQuillRef={() => {}}
      />
      {errors?.data?.content?.[0] && (
        <ErrorText>{errors?.data?.content?.[0]}</ErrorText>
      )}

      <AdvancedForm
        isAdvanced={isAdvanced}
        setIsAdvanced={setIsAdvanced}
        ref={advancedForm}
        disabled={creating}
        formValue={formValue}
        setFormValue={setFormValue}
      />

      <ButtonWrapper>
        <PrimaryButton
          loading={creating}
          onClick={createPost}
          disabled={isDisableCreate}
        >
          Create
        </PrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
}
