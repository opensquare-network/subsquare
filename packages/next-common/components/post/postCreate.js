import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Input from "../input";
import nextApi from "../../services/nextApi";
import { TYPE_POST } from "../../utils/viewConstants";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { shadow_100 } from "styles/componentCss";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { fetchUserProfile } from "next-common/store/reducers/userSlice";
import InsertContentsModal from "next-common/components/editor/modal";
import QuillEditor from "next-common/components/editor/quillEditor";
import HtmlRender from "next-common/components/post/htmlRender";
import MarkdownEditor from "next-common/components/markdownEditor";
import Button from "next-common/components/button";
import PreviewMD from "next-common/components/previewMD";
import Toggle from "next-common/components/toggle";
import ErrorText from "next-common/components/ErrorText";

const Wrapper = styled.div`
  padding: 48px;
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
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
  margin-top: 16px;

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

export default function PostCreate({ chain, type, loginUser }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );
  const [bannerUrl, setBannerUrl] = useState("");
  const [modalType, setModalType] = useState("image");
  const [showModal, setShowModal] = useState(false);
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);
  const [errors, setErrors] = useState();
  const [editorHeight, setEditorHeight] = useState(300);
  const isEmpty = content === "" || content === `<p><br></p>`;

  const createPost = async () => {
    const result = await nextApi.post(`posts`, {
      chain,
      title,
      content,
      contentType,
      bannerUrl,
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

  const onMarkdownSwitch = () => {
    if (
      content &&
      !confirm(`Toggling editor will empty all typed contents, are you sure ?`)
    ) {
      return;
    }

    const newContentType = contentType === "html" ? "markdown" : "html";
    setContent("");
    setContentType(newContentType);

    // Save to user preference
    nextApi
      .patch("user/preference", {
        editor: newContentType,
      })
      .then(({ result }) => {
        if (result) {
          dispatch(fetchUserProfile());
        }
      });
  };

  const [isSetBanner, setIsSetBanner] = useState(false);
  useEffect(() => {
    if (!isSetBanner) {
      setBannerUrl("");
    }
  }, [isSetBanner]);

  const isDiscussion = type === TYPE_POST;

  return (
    <Wrapper>
      <Title>New Post</Title>
      <LabelWrapper>
        <Label>Title</Label>
        {isDiscussion && (
          <ToggleText
            isSetBanner={isSetBanner}
            setIsSetBanner={setIsSetBanner}
          />
        )}
      </LabelWrapper>
      <Input
        placeholder="Please fill the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {isSetBanner && (
        <UploaderWrapper>
          <Uploader onSetImageUrl={setBannerUrl} />
        </UploaderWrapper>
      )}

      {errors?.data?.title?.[0] && (
        <ErrorText>{errors?.data?.title?.[0]}</ErrorText>
      )}
      {contentType === "html" && (
        <InsertContentsModal
          showModal={showModal}
          setShowModal={setShowModal}
          insetQuillContentsFunc={insetQuillContentsFunc}
          type={modalType}
        />
      )}

      <LabelWrapper>
        <Label>Issue</Label>
      </LabelWrapper>

      <InputWrapper>
        {contentType === "markdown" && (
          <MarkdownEditor
            initialHeight={300}
            height={editorHeight}
            setEditorHeight={setEditorHeight}
            content={content}
            setContent={setContent}
            visible={!showPreview}
          />
        )}
        {contentType === "html" && (
          <QuillEditor
            visible={!showPreview}
            content={content}
            setContent={setContent}
            height={editorHeight}
            setEditorHeight={setEditorHeight}
            setModalInsetFunc={(insetQuillContentFunc, type = "image") => {
              setModalType(type);
              setShowModal(true);
              setInsetQuillContentsFunc(insetQuillContentFunc);
            }}
            isCreate={true}
          />
        )}
        {!showPreview && (
          <InputSwitch>
            <img
              src="/imgs/icons/markdown-mark.svg"
              alt=""
              width={26}
              height={16}
            />
            <Toggle
              size="small"
              isOn={contentType === "markdown"}
              onToggle={onMarkdownSwitch}
            />
          </InputSwitch>
        )}
      </InputWrapper>
      {showPreview && (
        <PreviewWrapper className="preview">
          {contentType === "markdown" && (
            <PreviewMD content={content} setContent={setContent} />
          )}
          {contentType === "html" && <HtmlRender html={content} />}
        </PreviewWrapper>
      )}
      {errors?.data?.content?.[0] && (
        <ErrorText>{errors?.data?.content?.[0]}</ErrorText>
      )}
      <ButtonWrapper>
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Edit" : "Preview"}
        </Button>
        <Button onClick={createPost} disabled={isEmpty} secondary>
          Create
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
