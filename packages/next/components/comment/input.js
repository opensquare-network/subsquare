import styled, {css} from "styled-components";
import React, {useState} from "react";
import {useRouter} from "next/router";

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
  background-color: white;
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

function Input({
                 postId,
                 setIsEdit,
                 isEdit,
                 editContent,
                 editContentType,
                 onFinishedEdit,
                 commentId,
                 chain,
                 content, setContent,
                 contentType,
                 setContentType,
                 setQuillRef = null,
                 users=[],
               }, ref) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [insetQuillImgFunc, setInsetQuillImgFunc] = useState(null);

  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);

  const onMarkdownSwitch = () => {
    if (
      content &&
      !confirm(`Togging editor will empty all typed contents, are you sure ?`)
    ) {
      return;
    }
    setContent("");
    setContentType(contentType === "html" ? "markdown" : "html");
    localStorage.setItem("contentType", contentType === "html" ? "markdown" : "html");
  };


  const createComment = async () => {
    try {
      setLoading(true);
      const result = await nextApi.post(`${chain}/posts/${postId}/comments`, {
        content,
        contentType,
      });
      if (result.error) {
        setErrors(result.error);
      } else {
        setShowPreview(false);
        setContent("");
        await router.replace(`/[chain]/post/[id]`, {
          pathname: `/${chain}/post/${router.query.id}`,
        });
        setTimeout(() => {
          window && window.scrollTo(0, document.body.scrollHeight);
        }, 4);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async () => {
    setLoading(true);
    const {result, error} = await nextApi.patch(
      `${chain}/comments/${commentId}`,
      {
        content,
        contentType,
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
        contentType === "html" &&
        <UploadImgModal showImgModal={showImgModal} setShowImgModal={setShowImgModal}
                        insetQuillImgFunc={insetQuillImgFunc}/>
      }
      <InputWrapper ref={ref}>
        {contentType === "markdown" && (
          <MarkdownEditor
            height={114}
            {...{content,users}}
            setContent={onInputChange}
            visible={!showPreview}
          />
        )}
        {contentType === "html" && (
          <QuillEditor
            visible={!showPreview}
            {...{content,users}}
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
        <PreviewWrapper className="preview">
          {contentType === "markdown" && (
            <PreviewMD content={content} setContent={setContent}/>
          )}
          {contentType === "html" && <HtmlRender html={content}/>}
        </PreviewWrapper>
      )}
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {!isEdit && (
          <Button onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Edit" : "Preview"}
          </Button>
        )}
        {isEdit && <Button onClick={() => onFinishedEdit(false)}>Cancel</Button>}
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

export default React.forwardRef(Input);
