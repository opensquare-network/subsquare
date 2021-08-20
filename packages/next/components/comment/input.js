import styled from "styled-components";
import {useState} from "react";
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

export default function Input({postId}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [contentType, setContentType] = useState("html");
  const [showImgModal, setShowImgModal] = useState(false);
  const [insetQuillImgFunc, setInsetQuillImgFunc] = useState(null);
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
    router.replace("/post/[id]", {
      pathname: `/post/${router.query.id}`,
      query: {page: "last"},
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
      <InputWrapper>
        {
          contentType === "markdown" && <MarkdownEditor
            height={114}
            content={content}
            setContent={onInputChange}
            visible={!showPreview}
          />
        }
        {
          contentType === "html" && <QuillEditor
            visible={!showPreview}
            content={content}
            setContent={onInputChange}
            height={114}
            setModalInsetImgFunc={(insetImgFunc) => {
              setShowImgModal(true);
              setInsetQuillImgFunc(insetImgFunc);
            }}
          />
        }
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
          {
            contentType==="markdown" && <PreviewMD content={content} setContent={setContent}/>
          }
          {
            contentType==="html" && <HtmlRender html={content}/>
          }
        </PreviewWrapper>
      )}
      {errors?.message && <ErrorText>{errors?.message}</ErrorText>}
      <ButtonWrapper>
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Write" : "Preview"}
        </Button>
        <Button isLoading={loading} secondary onClick={createComment}>
          Comment
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}
