import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Input from "../input";
import nextApi from "../../services/nextApi";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import { Label, LabelWrapper } from "./styled";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ErrorText from "next-common/components/ErrorText";
import AdvancedForm from "next-common/components/post/advanced/form";
import dynamic from "next/dynamic";
import SecondaryButton from "../buttons/secondaryButton";
import EditorWrapper from "../editor/editorWrapper";
import { shadow_100 } from "../../styles/componentCss";
import { TitleContainer } from "../styled/containers/titleContainer";
import { useChain } from "../../context/chain";
import { useUser } from "../../context/user";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import PostLabel from "./postLabel";

const UniverseEditor = dynamic(
  () => import("@osn/rich-text-editor").then((mod) => mod.UniverseEditor),
  { ssr: false },
);

const Wrapper = styled(NeutralPanel)`
  padding: 48px;
  color: var(--textPrimary);
  ${shadow_100};
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

const InputWrapper = styled(EditorWrapper)`
  position: relative;
`;

const UploaderWrapper = styled.div`
  margin-top: 16px;
`;

export default function PostCreate() {
  const loginUser = useUser();
  const chain = useChain();
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown",
  );
  const [bannerCid, setBannerCid] = useState(null);
  const [formValue, setFormValue] = useState({});
  const [errors, setErrors] = useState();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const isEmpty = content === "" || content === "<p><br></p>";
  const [selectedLabels, setSelectedLabels] = useState([]);

  const createPost = async () => {
    setCreating(true);
    const result = await nextApi
      .post(
        "posts",
        {
          chain,
          title,
          content,
          contentType,
          bannerCid,
          labels: selectedLabels,
          ...formValue,
        },
        { credentials: "include" },
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
      setBannerCid(null);
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
      <TitleContainer>New Post</TitleContainer>
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
          <Uploader disabled={creating} onSetImageCid={setBannerCid} />
        </UploaderWrapper>
      )}

      {errors?.data?.title?.[0] && (
        <ErrorText>{errors?.data?.title?.[0]}</ErrorText>
      )}

      <PostLabel
        selectedLabels={selectedLabels}
        setSelectedLabels={setSelectedLabels}
      />

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
