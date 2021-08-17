import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import Layout from "components/layout";
import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import Input from "components/input";
import MarkdownEditor from "components/markdownEditor";
import Button from "components/button";
import nextApi from "services/nextApi";
import { addToast } from "store/reducers/toastSlice";

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

export default withLoginUserRedux(({ loginUser }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();

  const onCreate = async () => {
    const result = await nextApi.post("posts", {
      chain: "karura",
      title,
      content,
      contentType: "markdown",
    });
    if (result) {
      setTitle("");
      setContent("");
      dispatch(
        addToast({
          type: "success",
          message: "Create post successfully!",
        })
      );
    }
  };

  return (
    <Layout user={loginUser} left={<div />} right={<div />}>
      <Wrapper>
        <Back href="/discussions" text="Back to Discussions" />
        <ContentWrapper>
          <Title>New Post</Title>
          <Label>Title</Label>
          <Input
            placeholder="Please fill the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Label>Issue</Label>
          <MarkdownEditor
            height={377}
            content={content}
            setContent={setContent}
            visible={!showPreview}
          />
          <ButtonWrapper>
            <Button>Preview</Button>
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
  return {
    props: {},
  };
});
