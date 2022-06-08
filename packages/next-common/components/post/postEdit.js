import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../input";
import EditInput from "../editInput";
import nextApi from "../../services/nextApi";
import { toApiType } from "../../utils/viewfuncs";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import { TYPE_POST } from "../../utils/viewConstants";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import FlexBetweenCenter from "../styled/flexBetweenCenter";

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
`;

const LabelWrapper = styled(FlexBetweenCenter)`
  margin: 16px 0 8px;
`;

const UploaderWrapper = styled.div`
  margin-top: 16px;
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
      bannerUrl,
    });
  };
  const [bannerUrl, setBannerUrl] = useState(postData.bannerUrl);

  const [isSetBanner, setIsSetBanner] = useState(!!postData.bannerUrl);
  useEffect(() => {
    if (!isSetBanner) {
      setBannerUrl("");
    }
  }, [isSetBanner]);

  const isMounted = useIsMountedBool();

  const isDiscussion = type === TYPE_POST;

  return (
    <Wrapper>
      <Title>Edit</Title>
      <LabelWrapper>
        <Label>Title</Label>
        {isDiscussion && (
          <ToggleText
            isSetBanner={isSetBanner}
            setIsSetBanner={setIsSetBanner}
          />
        )}
      </LabelWrapper>
      <Input
        disabled={updating}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {isSetBanner && (
        <UploaderWrapper>
          <Uploader imageUrl={bannerUrl} onSetImageUrl={setBannerUrl} />
        </UploaderWrapper>
      )}

      <LabelWrapper>
        <Label>Issue</Label>
      </LabelWrapper>

      <EditInput
        editContent={postData.content}
        editContentType={postData.contentType}
        onFinishedEdit={async (reload) => {
          if (reload) {
            await updatePost();
          }

          if (isMounted()) {
            setIsEdit(false);
          }
        }}
        loading={updating}
        setLoading={setUpdating}
        update={editPost}
        type={type}
      />
    </Wrapper>
  );
}
