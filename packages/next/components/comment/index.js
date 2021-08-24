import styled from "styled-components";

import Item from "./item";
import Pagination from "components/pagination";
import NoComment from "./noComment";
import LoginButtons from "./loginButtons";
import Input from "./input";
import {useRef, useState} from "react";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
    margin: 0 -16px;
    border-radius: 0;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

export default function Comments({ user, postId, data, chain }) {
  const editorWrapperRef = useRef(null);
  const [quillRef, setQuillRef] = useState(null);
  const [contentType, setContentType] = useState(
     "html"
  );
  const [content, setContent] = useState("");

  function isUniqueInArray(value, index, self) {
    return self.indexOf(value) === index;
  }

  const users = data?.items?.map(comment => comment.author.username).filter(isUniqueInArray) ?? [];


  const onReply = (username) => {
    let reply = '';
    if (contentType === "markdown") {
      reply = `[@${username}](/member/${username}) `;
      const at = content ? `${reply}` : reply;
      if (content === reply) {
        setContent(``);
      } else {
        setContent(content + at);
      }
      editorWrapperRef.current?.querySelector("textarea")?.focus();
    } else if (contentType === "html") {
      const contents = quillRef.current.getEditor().getContents();
      reply = {
        "ops": [
          {
            "insert": {
              "mention": {
                "index": "0",
                "denotationChar": "@",
                "id": username,
                "value": username + " &nbsp; "
              }
            }
          },
          {"insert": "\n"}
        ]
      };
      quillRef.current.getEditor().setContents(contents.ops.concat(reply.ops));
      setTimeout(() => {
        quillRef.current.getEditor().setSelection(99999, 0, 'api'); //always put caret to the end
      }, 4)
    }
    editorWrapperRef.current?.scrollIntoView();
  };

  return (
    <Wrapper>
      <Title>Comments</Title>
      {data?.items?.length > 0 && (
        <>
          <div>
            {(data?.items || []).map((item) => (
              <Item key={item._id} data={item} user={user} chain={chain} onReply={onReply} />
            ))}
          </div>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
          />
        </>
      )}
      {!data?.items?.length > 0 && <NoComment />}
      {!user && <LoginButtons />}
      {user && <Input
        postId={postId}
        chain={chain}
        ref={editorWrapperRef}
        setQuillRef={setQuillRef}
        {...{contentType,setContentType,content, setContent,users}}
      />}
    </Wrapper>
  );
}
