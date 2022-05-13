import styled, { css } from "styled-components";
import React, { useState } from "react";
import { useRouter } from "next/router";
import MarkdownEditor from "next-common/components/markdownEditor";
import Toggle from "next-common/components/toggle";
import Button from "next-common/components/button";
import PreviewMD from "next-common/components/previewMD";
import nextApi from "../../services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import QuillEditor from "../editor/quillEditor";
import HtmlRender from "../post/htmlRender";
import InsertContentsModal from "../editor/modal";
import { fetchUserProfile } from "next-common/store/reducers/userSlice";
import { useDispatch } from "react-redux";
import Relative from "next-common/components/styled/relative";
import Flex from "next-common/components/styled/flex";
import { toApiType } from "../../utils/viewfuncs";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";

const Wrapper = styled.div`
  margin-top: 48px;
  ${(p) =>
    p.isEdit &&
    css`
      margin-top: 8px;
    `}
`;

const InputSwitch = styled(Flex)`
  background-color: white;
  height: 24px;
  top: 10px;
  right: 16px;
  position: absolute;

  > img {
    margin-right: 12px;
  }
`;

const ButtonWrapper = styled(Flex)`
  margin-top: 16px;
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

function Editor(
  {
    postId,
    isEdit,
    onFinishedEdit,
    commentId,
    chain,
    content,
    setContent,
    contentType,
    setContentType,
    setQuillRef = null,
    users = [],
    type,
  },
  ref
) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("image");
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);
  const [editorHeight, setEditorHeight] = useState(100);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMountedBool();

  const onMarkdownSwitch = () => {
    if (
      content &&
      !confirm(`Togging editor will empty all typed contents, are you sure ?`)
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
        if (result && isMounted()) {
          dispatch(fetchUserProfile());
        }
      });
  };

  const createComment = async () => {
    if (!isMounted()) {
      return;
    }

    try {
      setLoading(true);
      const result = await nextApi.post(
        `${toApiType(type)}/${postId}/comments`,
        {
          content,
          contentType,
        },
        { credentials: "include" }
      );

      if (!isMounted()) {
        return;
      }

      if (result.error) {
        setErrors(result.error);
      } else {
        setShowPreview(false);
        setContent("");
        await router.replace(`[id]`, {
          pathname: `${router.query.id}`,
        });
        setTimeout(() => {
          if (isMounted()) {
            window && window.scrollTo(0, document.body.scrollHeight);
          }
        }, 4);
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  };

  const updateComment = async () => {
    setLoading(true);
    const { result, error } = await nextApi.patch(`comments/${commentId}`, {
      content,
      contentType,
    });

    if (!isMounted()) {
      return;
    }

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

  const isEmpty = content === "" || content === `<p><br></p>`;

  return (
    <Wrapper>
      {contentType === "html" && (
        <InsertContentsModal
          showModal={showModal}
          setShowModal={setShowModal}
          insetQuillContentsFunc={insetQuillContentsFunc}
          type={modalType}
        />
      )}
      <Relative ref={ref}>
        {contentType === "markdown" && (
          <MarkdownEditor
            height={editorHeight}
            setEditorHeight={setEditorHeight}
            {...{ content, users }}
            setContent={onInputChange}
            visible={!showPreview}
          />
        )}
        {contentType === "html" && (
          <QuillEditor
            visible={!showPreview}
            {...{ content, users }}
            setContent={onInputChange}
            height={editorHeight}
            setModalInsetFunc={(insetFunc, type) => {
              setModalType(type);
              setShowModal(true);
              setInsetQuillContentsFunc(insetFunc);
            }}
            setQuillRef={setQuillRef}
            setEditorHeight={setEditorHeight}
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
      </Relative>
      {showPreview && (
        <PreviewWrapper className="preview">
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
            {showPreview ? "Edit" : "Preview"}
          </Button>
        )}
        {isEdit && (
          <Button onClick={() => onFinishedEdit(false)}>Cancel</Button>
        )}
        <Button
          isLoading={loading}
          secondary
          onClick={isEdit ? updateComment : createComment}
          disabled={isEmpty}
          title={isEmpty ? "cannot submit empty content" : ""}
        >
          {isEdit ? "Update" : "Comment"}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default React.forwardRef(Editor);
