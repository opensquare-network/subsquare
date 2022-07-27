import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import Input from "../input";
import nextApi from "../../services/nextApi";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { shadow_100 } from "styles/componentCss";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ErrorText from "next-common/components/ErrorText";
import AdvancedForm from "next-common/components/post/advanced/form";
import dynamic from "next/dynamic";
import SecondaryButton from "../buttons/secondaryButton";
import { editorOverride } from "../../styles/editorOverride";

const UniverseEditor = dynamic(
  () => import("@osn/rich-text-editor").then((mod) => mod.UniverseEditor),
  { ssr: false }
);

const Wrapper = styled.div`
  padding: 48px;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  ${shadow_100};
  border-radius: 6px;
  textarea:read-only,
  div.ql-disabled {
    background-color: ${(props) => props.theme.grey100Bg} !important;
  }

  div + textarea {
    border-color: ${(props) => props.theme.grey300Border};
  }
  input {
    color: ${(props) => props.theme.textPrimary};
  }

  @media screen and (max-width: 768px) {
    margin-left: -16px;
    margin-right: -16px;
    border-radius: 0;
    padding: 24px;
  }
  ${(props) =>
    props?.theme.isDark &&
    css`
      div {
        border-color: #363a4d !important;
      }
    `};
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 24px;
`;

const LabelWrapper = styled(FlexBetweenCenter)`
  margin: 16px 0 8px;
`;
const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
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

const InputWrapper = styled.div`
  position: relative;
  ${editorOverride};
`;

const UploaderWrapper = styled.div`
  margin-top: 16px;
`;

export default function PostCreate({ chain, loginUser }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );
  const [bannerUrl, setBannerUrl] = useState("");
  const [formValue, setFormValue] = useState({});
  const [errors, setErrors] = useState();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const isEmpty = content === "" || content === `<p><br></p>`;

  const createPost = async () => {
    setCreating(true);
    const result = await nextApi
      .post(
        `posts`,
        {
          chain,
          title,
          content,
          contentType,
          bannerUrl,
          ...formValue,
        },
        { credentials: "include" }
      )
      .finally(() => {
        setCreating(false);
      });
    if (result.error) {
      if (result.error.data) {
        setErrors(result.error);
      } else {
        dispatch(newErrorToast(result.error.message));
      }
    } else {
      router.push(`/post/${result.result}`);
    }
  };

  const [isSetBanner, setIsSetBanner] = useState(false);
  useEffect(() => {
    if (!isSetBanner) {
      setBannerUrl("");
    }
  }, [isSetBanner]);

  const advancedForm = useRef();

  const isDisableCreate = useMemo(() => {
    let result = true;
    const validatePass = isAdvanced
      ? advancedForm.current?.validateForm()
      : true;
    result = isEmpty || !validatePass;

    return result;
  }, [isEmpty, formValue, isAdvanced]);

  return (
    <Wrapper>
      <Title>New Post</Title>
      <LabelWrapper>
        <Label>Title</Label>
        <ToggleText
          disabled={creating}
          isSetBanner={isSetBanner}
          setIsSetBanner={setIsSetBanner}
        />
      </LabelWrapper>
      <Input
        disabled={creating}
        placeholder="Please fill the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {isSetBanner && (
        <UploaderWrapper>
          <Uploader disabled={creating} onSetImageUrl={setBannerUrl} />
        </UploaderWrapper>
      )}

      {errors?.data?.title?.[0] && (
        <ErrorText>{errors?.data?.title?.[0]}</ErrorText>
      )}
      <LabelWrapper>
        <Label>Issue</Label>
      </LabelWrapper>

      <InputWrapper>
        <UniverseEditor
          value={content}
          onChange={setContent}
          contentType={contentType}
          setContentType={setContentType}
          loadSuggestions={() => []}
          minHeight={300}
          setQuillRef={() => {}}
        />
      </InputWrapper>
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
        <SecondaryButton
          isLoading={creating}
          onClick={createPost}
          disabled={isDisableCreate}
        >
          Create
        </SecondaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
}
