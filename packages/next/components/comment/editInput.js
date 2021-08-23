import styled, { css } from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";

import MarkdownEditor from "components/markdownEditor";
import Toggle from "components/toggle";
import Button from "components/button";
import PreviewMD from "components/create/previewMD";
import nextApi from "services/nextApi";
import ErrorText from "components/ErrorText";
import QuillEditor from "../editor/quillEditor";
import HtmlRender from "../post/htmlRender";
import UploadImgModal from "../editor/imageModal";

const Wrapper = styled.div`
  margin-top: 48px;
  ${(p) =>
    p.isEdit &&
    css`
      margin-top: 8px;
    `}
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

const ButtonWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-editContent: flex-end;

  > :not(:first-child) {
    margin-left: 12px;
  }
`;

const PreviewWrapper = styled.div`
  display: flex;
  min-height: 157px;

  > * {
    flex-grow: 1;
    min-height: 157px;
  }
`;

export default function EditInput({
  editContent,
  editContentType,
  onFinishedEdit,
  commentId,
  setQuillRef=null,
}) {
  const [content, setContent] = useState(editContent);
  const [contentType, setContentType] = useState(editContentType);
  const [showPreview, setShowPreview] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [insetQuillImgFunc, setInsetQuillImgFunc] = useState(null);

  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);

  const onMarkdownSwitch = () => {
    // console.log(contentType)
    if (
      content &&
      !confirm(`切换编辑器会清空当前输入的内容，确定要继续切换吗？`)
    ) {
      return;
    }
    setContent("");
    setContentType(contentType === "html" ? "markdown" : "html");
  };

  const updateComment = async () => {
    setLoading(true);
    const { result, error } = await nextApi.fetch(
      `comments/${commentId}`,
      {},
      {
        method: "PATCH",
        credentials: "same-origin",
        body: JSON.stringify({
          content,
          contentType,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    setLoading(false);
    if (error) {
      setErrors(error);
    } else if (result) {
      onFinishedEdit(true);
    }
  };

  const onInputChange = (value) => {
    setContent(value);
    setErrors(null);
  };

  return (
    <Wrapper>
      {
        editContentType === "html" &&
        <UploadImgModal showImgModal={showImgModal} setShowImgModal={setShowImgModal}
                        insetQuillImgFunc={insetQuillImgFunc}/>
      }
      <InputWrapper>
        {editContentType === "markdown" && (
          <MarkdownEditor
            height={114}
            content={content}
            setContent={onInputChange}
            visible={!showPreview}
          />
        )}
        {editContentType === "html" && (
          <QuillEditor
            visible={!showPreview}
            content={content}
            setContent={onInputChange}
            height={114}
            setModalInsetImgFunc={(insetImgFunc) => {
              setShowImgModal(true);
              setInsetQuillImgFunc(insetImgFunc);
            }}
            setQuillRef={setQuillRef}
          />
        )}
        {!showPreview && (
          <InputSwitch>
            <img src="/imgs/icons/markdown-mark.svg" alt=""/>
            <Toggle
              size="small"
              isOn={contentType === "markdown"}
              onToggle={onMarkdownSwitch}
            />
          </InputSwitch>
        )}
      </InputWrapper>
      {showPreview && (
        <PreviewWrapper>
          {contentType === "markdown" && (
            <PreviewMD editContent={editContent} setEditContent={setEditContent} />
          )}
          {contentType === "html" && <HtmlRender html={editContent} />}
        </PreviewWrapper>
      )}
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        <Button onClick={() => onFinishedEdit(false)}>Cancel</Button>
        <Button
          isLoading={loading}
          secondary
          onClick={updateComment}
        >
          Update
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
