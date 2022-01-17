import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import Input from "components/input";
import MarkdownEditor from "components/markdownEditor";
import Button from "next-common/components/button";
import nextApi from "services/nextApi";
import PreviewMD from "components/create/previewMD";
import Toggle from "components/toggle";
import ErrorText from "next-common/components/ErrorText";
import InsertContentsModal from "components/editor/modal";
import QuillEditor from "components/editor/quillEditor";
import HtmlRender from "components/post/htmlRender";
import { useDispatch } from "react-redux";
import { addToast } from "store/reducers/toastSlice";
import { fetchUserProfile } from "store/reducers/userSlice";
import { shadow_100 } from "styles/componentCss";
import NextHead from "components/nextHead";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 848px;
  margin: auto;
`;

const ContentWrapper = styled.div`
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

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin: 16px 0 8px;
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

export default withLoginUserRedux(({ loginUser, chain }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [contentType, setContentType] = useState(
    loginUser?.preference.editor || "markdown"
  );
  const [modalType, setModalType] = useState("image");
  const [showModal, setShowModal] = useState(false);
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);
  const [errors, setErrors] = useState();
  const [editorHeight, setEditorHeight] = useState(200);

  const onCreate = async () => {
    const result = await nextApi.post(`posts`, {
      chain,
      title,
      content,
      contentType,
    });
    if (result.error) {
      if (result.error.data) {
        setErrors(result.error);
      } else {
        dispatch(
          addToast({
            type: "error",
            message: result.error.message,
          })
        );
      }
    } else {
      router.push(`/post/${result.result}`);
    }
  };

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

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Create post`} desc={``} />
      <Wrapper>
        <Back href={`/discussions`} text="Back to Discussions" />
        <ContentWrapper>
          <Title>New Post</Title>
          <Label>Title</Label>
          <Input
            placeholder="Please fill the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
          <Label>Issue</Label>
          <InputWrapper>
            {contentType === "markdown" && (
              <MarkdownEditor
                height={editorHeight}
                setEditorHeight={setEditorHeight}
                content={content}
                setContent={setContent}
                visible={!showPreview}
                isCreate={true}
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
          {errors?.data?.content?.[0] && (
            <ErrorText>{errors?.data?.content?.[0]}</ErrorText>
          )}
          <ButtonWrapper>
            <Button onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button secondary onClick={onCreate}>
              Create
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
