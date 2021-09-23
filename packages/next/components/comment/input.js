import styled, { css } from "styled-components";
import React, { useState } from "react";
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
import { fetchUserProfile } from "store/reducers/userSlice";
import { useDispatch } from "react-redux";
import Relative from "components/styled/relative";
import Flex from "../styled/flex";

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

function Input(
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

  const createComment = async () => {
    try {
      setLoading(true);
      const result = await nextApi.post(
        `${chain}/${type}s/${postId}/comments`,
        {
          content,
          contentType,
        },
        { credentials: "include" }
      );
      if (result.error) {
        setErrors(result.error);
      } else {
        setShowPreview(false);
        setContent("");
        await router.replace(`/[chain]/${type}/[id]`, {
          pathname: `/${chain}/${type}/${router.query.id}`,
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
    const { result, error } = await nextApi.patch(
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
      {contentType === "html" && (
        <UploadImgModal
          showImgModal={showImgModal}
          setShowImgModal={setShowImgModal}
          insetQuillImgFunc={insetQuillImgFunc}
        />
      )}
      <Relative ref={ref}>
        {contentType === "markdown" && (
          <MarkdownEditor
            height={114}
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
            <img src="/imgs/icons/markdown-mark.svg" alt="" />
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
        >
          {isEdit ? "Update" : "Comment"}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default React.forwardRef(Input);
