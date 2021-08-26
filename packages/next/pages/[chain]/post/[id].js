import styled from "styled-components";

import Layout from "components/layout";
import Back from "components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import {EmptyList} from "../../../utils/constants";
import Input from "../../../components/comment/input";
import {useState, useRef} from "react";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 848px;
  margin: auto;
`;

const CommentsWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
  0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
  0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
    margin: 0 -16px;
    border-radius: 0;
  }
`



export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const postId = detail._id;

  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("html");

  function isUniqueInArray(value, index, self) {
    return self.indexOf(value) === index;
  }

  const users =
    comments?.items
      ?.map((comment) => comment.author.username)
      .filter(isUniqueInArray) ?? [];


  const focusEditor = () => {
    if (contentType === "markdown") {
      editorWrapperRef.current?.querySelector("textarea")?.focus();
    } else if (contentType === "html") {
      setTimeout(() => {
        quillRef.current.getEditor().setSelection(99999, 0, "api"); //always put caret to the end
      }, 4);
    }
    editorWrapperRef.current?.scrollIntoView();
  }

  const onReply = (username) => {
    let reply = "";
    if (contentType === "markdown") {
      reply = `[@${username}](/member/${username}) `;
      const at = content ? `${reply}` : reply;
      if (content === reply) {
        setContent(``);
      } else {
        setContent(content + at);
      }
    } else if (contentType === "html") {
      const contents = quillRef.current.getEditor().getContents();
      reply = {
        ops: [
          {
            insert: {
              mention: {
                index: "0",
                denotationChar: "@",
                id: username,
                value: username + " &nbsp; ",
              },
            },
          },
          { insert: "\n" },
        ],
      };
      quillRef.current.getEditor().setContents(contents.ops.concat(reply.ops));
    }
    focusEditor();
  };

  return (
    <Layout user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href="/" text="Back to Overview" />
        <DetailItem data={detail} user={loginUser} chain={chain} onReply={focusEditor} />
        <CommentsWrapper>
          <Comments
            data={comments}
            user={loginUser}
            postId={postId}
            chain={chain}
            onReply={onReply}
          />
          {loginUser && (
            <Input
              postId={postId}
              chain={chain}
              ref={editorWrapperRef}
              setQuillRef={setQuillRef}
              {...{ contentType, setContentType, content, setContent, users }}
            />
          )}
        </CommentsWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain, id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  const postId = detail._id;

  const { result: comments } = await nextApi.fetch(`posts/${postId}/comments`, {
    page: page ?? "last",
    pageSize: Math.min(pageSize ?? 50, 100),
  });

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
