import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../input";
import EditInput from "../editInput";
import nextApi from "../../services/nextApi";
import { toApiType } from "../../utils/viewfuncs";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import FlexBetweenCenter from "../styled/flexBetweenCenter";
import { TitleContainer } from "../styled/containers/titleContainer";
import { EditablePanel } from "../styled/panel";

const Wrapper = styled(EditablePanel)`
  textarea:read-only,
  div.ql-disabled {
    background-color: ${(props) => props.theme.grey100Bg} !important;
  }
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
      bannerCid,
    });
  };
  const [bannerCid, setBannerCid] = useState(postData.bannerCid);

  const [isSetBanner, setIsSetBanner] = useState(!!postData.bannerCid);
  useEffect(() => {
    if (!isSetBanner) {
      setBannerCid(null);
    }
  }, [isSetBanner]);

  const isMounted = useIsMountedBool();

  return (
    <Wrapper>
      <TitleContainer>Edit</TitleContainer>
      <LabelWrapper>
        <Label>Title</Label>
        <ToggleText
          disabled={updating}
          isSetBanner={isSetBanner}
          setIsSetBanner={setIsSetBanner}
        />
      </LabelWrapper>
      <Input
        disabled={updating}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {isSetBanner && (
        <UploaderWrapper>
          <Uploader
            disabled={updating}
            imageCid={bannerCid}
            onSetImageCid={setBannerCid}
          />
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
      />
    </Wrapper>
  );
}
