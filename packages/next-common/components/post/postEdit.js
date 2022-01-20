import styled from "styled-components";
import { useState } from "react";
import React from "react";
import Input from "components/input";
import EditInput from "components/editInput";
import nextApi from "services/nextApi";
import { toApiType } from "utils/viewfuncs";

const Wrapper = styled.div`
  textarea:read-only,
  div.ql-disabled {
    background-color: #f6f7fa !important;
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

export default function PostEdit({
  chain,
  postData,
  setIsEdit,
  updatePost,
  type,
}) {
  const [title, setTitle] = useState(postData.title);
  const [updating, setUpdating] = useState(false);
  const editPost = async (content, contentType) => {
    const url = `${toApiType(type)}/${postData._id}`;
    return await nextApi.patch(url, {
      title,
      content,
      contentType,
    });
  };

  return (
    <Wrapper>
      <Title>Edit</Title>
      <Label>Title</Label>
      <Input
        disabled={updating}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Label>Issue</Label>
      <EditInput
        editContent={postData.content}
        editContentType={postData.contentType}
        onFinishedEdit={async (reload) => {
          if (reload) {
            await updatePost();
          }
          setIsEdit(false);
        }}
        loading={updating}
        setLoading={setUpdating}
        update={editPost}
      />
    </Wrapper>
  );
}
