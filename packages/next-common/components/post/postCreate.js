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
import PrimaryButton from "next-common/lib/button/primary";
import { TitleContainer } from "../styled/containers/titleContainer";
import { useChain } from "../../context/chain";
import { useUser } from "../../context/user";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import PostLabel from "./postLabel";
import Editor, { useEditorUploading } from "../editor";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

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

const UploaderWrapper = styled.div`
  margin-top: 16px;
`;

export default function PostCreate() {
  const user = useUser();
  const chain = useChain();
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [bannerCid, setBannerCid] = useState(null);
  const [formValue, setFormValue] = useState({});
  const [errors, setErrors] = useState();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const isEmpty = title === "" || content === "" || content === "<p><br></p>";
  const [selectedLabels, setSelectedLabels] = useState([]);
  const { ensureLogin } = useEnsureLogin();
  const [editorUploading] = useEditorUploading();

  const createPost = async () => {
    setCreating(true);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { result, error } = await nextApi.post(
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
      );

      if (error) {
        if (error.data) {
          setErrors(error);
        } else {
          dispatch(newErrorToast(error.message));
        }
      } else {
        router.push(`/posts/${result}`);
      }
    } finally {
      setCreating(false);
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
    result = isEmpty || !validatePass || editorUploading;

    return result;
  }, [isEmpty, isAdvanced, editorUploading]);

  return (
    <Wrapper>
      <TitleContainer className="!px-0">New Post</TitleContainer>
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
