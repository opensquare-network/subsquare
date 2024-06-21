import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Input from "../input";
import EditInput from "../editInput";
import nextApi from "../../services/nextApi";
import { toApiType } from "../../utils/viewfuncs";
import { useMountedState } from "react-use";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import { usePost, usePostTitle } from "../../context/post";
import { useDetailType } from "../../context/page";
import PostLabel from "./postLabel";
import { detailPageCategory } from "../../utils/consts/business/category";
import FormItem from "../form/item";

const UploaderWrapper = styled.div`
  margin-top: 16px;
`;

export default function PostEdit({ setIsEdit, updatePost }) {
  const type = useDetailType();
  const post = usePost();
  const defaultTitle = usePostTitle();
  const [title, setTitle] = useState(defaultTitle);
  const [updating, setUpdating] = useState(false);
  const [bannerCid, setBannerCid] = useState(post.bannerCid);
  const [selectedLabels, setSelectedLabels] = useState(post.labels || []);
  const postType = useDetailType();

  const [isSetBanner, setIsSetBanner] = useState(!!post.bannerCid);
  useEffect(() => {
    if (!isSetBanner) {
      setBannerCid(null);
    }
  }, [isSetBanner]);

  const editPost = useCallback(
    async (content, contentType) => {
      const url = `${toApiType(type)}/${post._id}`;
      return await nextApi.patch(url, {
        title,
        content,
        contentType,
        bannerCid,
        labels: selectedLabels,
      });
    },
    [type, post, bannerCid, title, selectedLabels],
  );

  const isMounted = useMountedState();

  return (
    <div>
      <FormItem
        label="Title"
        labelExternal={
          <ToggleText
            disabled={updating}
            isSetBanner={isSetBanner}
            setIsSetBanner={setIsSetBanner}
          />
        }
      >
        <Input
          disabled={updating}
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormItem>

      {isSetBanner && (
        <UploaderWrapper>
          <Uploader
            disabled={updating}
            imageCid={bannerCid}
            onSetImageCid={setBannerCid}
          />
        </UploaderWrapper>
      )}

      {postType === detailPageCategory.POST && (
        <PostLabel
          selectedLabels={selectedLabels}
          setSelectedLabels={setSelectedLabels}
        />
      )}

      <FormItem label="Issue">
        <EditInput
          editContent={post.content || ""}
          editContentType={post.contentType}
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
      </FormItem>
    </div>
  );
}
