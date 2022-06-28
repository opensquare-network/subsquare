import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Input from "../input";
import nextApi from "../../services/nextApi";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { shadow_100 } from "styles/componentCss";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import Button from "next-common/components/button";
import ErrorText from "next-common/components/ErrorText";
import AdvancedForm from "next-common/components/post/advanced/form";
import dynamic from 'next/dynamic'
const UniverseEditor = dynamic(() => import("@osn/rich-text-editor").then(mod=> mod.UniverseEditor),{ssr:false})


const Wrapper = styled.div`
  padding: 48px;
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  textarea:read-only,
  div.ql-disabled {
    background-color: #f6f7fa !important;
  }
  @media screen and (max-width: 768px) {
    margin-left: -16px;
    margin-right: -16px;
    border-radius: 0;
    padding: 24px;
  }
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
`;

const InputSwitch = styled.div`
  height: 24px;
  top: 10px;
  right: 16px;
  position: absolute;
  display: flex;
  align-items: center;

  > img {
    margin-right: 12px;
  }
`;

const PreviewWrapper = styled.div`
  display: flex;
  min-height: 244px;
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
  const [showPreview, setShowPreview] = useState(false);
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
      .post(`posts`, {
        chain,
        title,
        content,
        contentType,
        bannerUrl,
        ...formValue,
      })
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
          loadSuggestions={()=> []}
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
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Edit" : "Preview"}
        </Button>
        <Button
          isLoading={creating}
          onClick={createPost}
          disabled={isDisableCreate}
          secondary
        >
          Create
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
