import styled from "styled-components";
import {useState} from "react";
import {useRouter} from "next/router";

import Layout from "components/layout";
import Back from "components/back";
import {withLoginUser, withLoginUserRedux} from "lib";
import Input from "components/input";
import MarkdownEditor from "components/markdownEditor";
import Button from "components/button";
import nextApi from "services/nextApi";
import PreviewMD from "components/create/previewMD";
import Toggle from "components/toggle";
import ErrorText from "components/ErrorText";
import UploadImgModal from "components/editor/imageModal";
import QuillEditor from "../../../components/editor/quillEditor";
import HtmlRender from "../../../components/post/htmlRender";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

`;

const ContentWrapper = styled.div`
  padding: 48px;
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
  0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
  0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
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
  min-height: 410px;
`;

export default withLoginUserRedux(({loginUser, chain}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [contentType, setContentType] = useState("html");
  const [showImgModal, setShowImgModal] = useState(false);
  const [insetQuillImgFunc, setInsetQuillImgFunc] = useState(null);
  const [errors, setErrors] = useState();

  const onCreate = async () => {
    const result = await nextApi.post("posts", {
      chain,
      title,
      content,
      contentType,
    });
    if (result.error) {
      setErrors(result.error);
    } else {
      router.push(`/${chain}/post/${result.result}`);
    }
  };

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

  return (
    <Layout user={loginUser}>
      <Wrapper>
        <Back href={`/${chain}/discussions`} text="Back to Discussions"/>
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
          {
            contentType === "html" &&
            <UploadImgModal showImgModal={showImgModal} setShowImgModal={setShowImgModal}
                            insetQuillImgFunc={insetQuillImgFunc}/>
          }
          <Label>Issue</Label>
          <InputWrapper>
            {
              contentType === "markdown" && <MarkdownEditor
                height={200}
                content={content}
                setContent={setContent}
                visible={!showPreview}
              />
            }
            {
              contentType === "html" && <QuillEditor
                visible={!showPreview}
                content={content}
                setContent={setContent}
                height={200}
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
                contentType === "markdown" && <PreviewMD content={content} setContent={setContent}/>
              }
              {
                contentType === "html" && <HtmlRender html={content}/>
              }
            </PreviewWrapper>
          )}
          {errors?.data?.content?.[0] && (
            <ErrorText>{errors?.data?.content?.[0]}</ErrorText>
          )}
          {errors?.message && !errors?.data && (
            <ErrorText>{errors?.message}</ErrorText>
          )}
          <ButtonWrapper>
            <Button onClick={() => setShowPreview(!showPreview)}>
              Preview
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
  const {chain} = context.query;

  return {
    props: {
      chain
    },
  };
});
