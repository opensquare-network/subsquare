import styled from "styled-components";
import { useState } from "react";
import MarkdownEditor from "components/markdownEditor";
import Toggle from "components/toggle";
import Button from "components/button";
import PreviewMD from "components/create/previewMD";
import ErrorText from "components/ErrorText";
import QuillEditor from "./editor/quillEditor";
import HtmlRender from "./post/htmlRender";
import InsertContentsModal from "./editor/modal";

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
}) {
  const [content, setContent] = useState(editContent);
  const [contentType, setContentType] = useState(editContentType);
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("image");
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);

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
  };

  const onUpdate = async () => {
    setLoading(true);
    const { result, error } = await update(content, contentType);
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
            setModalInsetFunc={(insetImgFunc, type) => {
              setModalType(type);
              setShowModal(true);
              setInsetQuillContentsFunc(insetImgFunc);
            }}
            setQuillRef={setQuillRef}
          />
        )}
        {!showPreview && (
          <InputSwitch>
            <img src="/imgs/icons/markdown-mark.svg" alt="" width={26} height={16} />
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
          {contentType === "html" && <HtmlRender html={editContent} />}
        </PreviewWrapper>
      )}
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        <Button onClick={() => onFinishedEdit(false)}>Cancel</Button>
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Edit" : "Preview"}
        </Button>
        <Button isLoading={loading} secondary onClick={onUpdate}>
          Update
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
