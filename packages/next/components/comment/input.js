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
  justify-content: flex-end;

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

export default function Input({
  postId,
  isEdit,
  editContent,
  editContentType,
  setIsEdit,
  commentId,
}) {
  const router = useRouter();
  const [content, setContent] = useState(isEdit ? editContent : "");
  const [showPreview, setShowPreview] = useState(false);
  const [contentType, setContentType] = useState(
    isEdit ? editContentType : "html"
  );
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);

  const onMarkdownSwitch = () => {
    if (
      content &&
      !confirm(`切换编辑器会清空当前输入的内容，确定要继续切换吗？`)
    ) {
      return;
    }
    setContent("");
    setContentType(contentType === "html" ? "markdown" : "html");
  };

  const refreshData = () => {
    router.replace("/[chain]/post/[id]", {
      pathname: `/${router.query.chain}/post/${router.query.id}`,
      query: { page: "last" },
    });
  };

  const createComment = async () => {
    setLoading(true);
    const result = await nextApi.post(`posts/${postId}/comments`, {
      content,
      contentType,
    });
    setLoading(false);
    if (result.error) {
      setErrors(result.error);
    } else {
      setShowPreview(false);
      setContent("");
      refreshData();
    }
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
      setIsEdit(false);
      router.replace("/[chain]/post/[id]", {
        pathname: `/${router.query.chain}/post/${router.query.id}`,
        query: { page: router.query.page },
      });
    }
  };

  const onInputChange = (value) => {
    setContent(value);
    setErrors(null);
  };

  return (
    <Wrapper isEdit={isEdit}>
      <InputWrapper>
        {contentType === "markdown" && (
          <MarkdownEditor
            height={114}
            content={content}
            setContent={onInputChange}
            visible={!showPreview}
          />
        )}
        {contentType === "html" && (
          <QuillEditor
            visible={!showPreview}
            content={content}
            setContent={onInputChange}
            height={114}
            setModalInsetImgFunc={() => {}}
          />
        )}
        {!showPreview && (
          <InputSwitch>
            <img src="/imgs/icons/markdown-mark.svg" />
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
            <PreviewMD content={content} setContent={setContent} />
          )}
          {contentType === "html" && <HtmlRender html={content} />}
        </PreviewWrapper>
      )}
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {!isEdit && (
          <Button onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Write" : "Preview"}
          </Button>
        )}
        {isEdit && <Button onClick={() => setIsEdit(false)}>Cancel</Button>}
        <Button
          isLoading={loading}
          secondary
          onClick={isEdit ? updateComment : createComment}
        >
          {isEdit ? "Update" : "Comment"}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
