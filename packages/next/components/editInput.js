import styled from "styled-components";
import { useState } from "react";
import MarkdownEditor from "components/markdownEditor";
import Toggle from "next-common/components/toggle";
import Button from "next-common/components/button";
import PreviewMD from "next-common/components/previewMD";
import ErrorText from "next-common/components/ErrorText";
import QuillEditor from "next-common/components/editor/quillEditor";
import HtmlRender from "next-common/components/post/htmlRender";
import InsertContentsModal from "next-common/components/editor/modal";

const Wrapper = styled.div`
  margin-top: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputSwitch = styled.div`
  height: 24px;
  top: 10px;
  right: 1px;
  padding-right: 15px;
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

export default function EditInput({
  editContent,
  editContentType,
  onFinishedEdit,
  update,
  setQuillRef = null,
  loading,
  setLoading,
}) {
  const [content, setContent] = useState(editContent);
  const [contentType, setContentType] = useState(editContentType);
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("image");
  const [editorHeight, setEditorHeight] = useState(100);
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);
  const [errors, setErrors] = useState();

  const onMarkdownSwitch = () => {
    if (loading) {
      return;
    }
    if (
      content &&
      !confirm(`Togging editor will empty all typed contents, are you sure ?`)
    ) {
      return;
    }
    setContent("");
    setContentType(contentType === "html" ? "markdown" : "html");
  };

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

  const onInputChange = (value) => {
    setContent(value);
    setErrors(null);
  };

  return (
    <Wrapper>
      {contentType === "html" && (
        <InsertContentsModal
          showModal={showModal}
          type={modalType}
          setShowModal={setShowModal}
          insetQuillContentsFunc={insetQuillContentsFunc}
        />
      )}
      <InputWrapper>
        {contentType === "markdown" && (
          <MarkdownEditor
            height={editorHeight}
            setEditorHeight={setEditorHeight}
            content={content}
            setContent={onInputChange}
            visible={!showPreview}
            readOnly={loading}
          />
        )}
        {contentType === "html" && (
          <QuillEditor
            visible={!showPreview}
            content={content}
            setContent={onInputChange}
            setEditorHeight={setEditorHeight}
            height={editorHeight}
            setModalInsetFunc={(insetImgFunc, type) => {
              setModalType(type);
              setShowModal(true);
              setInsetQuillContentsFunc(insetImgFunc);
            }}
            setQuillRef={setQuillRef}
            readOnly={loading}
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
            <PreviewMD
              content={content}
              setContent={setContent}
              maxHeight={editorHeight}
            />
          )}
          {contentType === "html" && (
            <HtmlRender html={content} maxHeight={editorHeight} />
          )}
        </PreviewWrapper>
      )}
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        {!loading && (
          <Button onClick={() => onFinishedEdit(false)}>Cancel</Button>
        )}
        {!loading && (
          <Button onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Edit" : "Preview"}
          </Button>
        )}
        <Button isLoading={loading} secondary onClick={onUpdate}>
          Update
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
