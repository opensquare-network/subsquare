import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Input from "../input";
import EditInput from "../editInput";
import { useMountedState } from "react-use";
import ToggleText from "../uploadBanner/toggleText";
import Uploader from "../uploadBanner/uploader";
import { usePost, usePostTitle } from "../../context/post";
import { useDetailType } from "../../context/page";
import PostLabel from "./postLabel";
import { detailPageCategory } from "../../utils/consts/business/category";
import FormItem from "../form/item";
import { useArticleActions } from "next-common/sima/context/articleActions";
import { getRealField } from "next-common/sima/actions/common";
import usePostProxyAuthor from "next-common/hooks/usePostProxyAuthor";
import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";
import useShouldUseSimaPostEdit from "next-common/sima/hooks/useShouldUseSimaPostEdit";

const UploaderWrapper = styled.div`
  margin-top: 16px;
`;

function SimaEditInput({ update, ...props }) {
  const proxyAuthor = usePostProxyAuthor();
  const isAuthor = useIsPostAuthor();
  return (
    <EditInput
      {...props}
      updateButtonText={isAuthor ? "Update" : "Update as a proxy"}
      update={(content, contentType) =>
        update(content, contentType, !isAuthor ? proxyAuthor : undefined)
      }
    />
  );
}

function MaybeSimaEditInput(props) {
  const isUseSimaEdit = useShouldUseSimaPostEdit();
  if (isUseSimaEdit) {
    return <SimaEditInput {...props} />;
  }
  return <EditInput {...props} />;
}

export default function PostEdit({ setIsEdit }) {
  const post = usePost();
  const defaultTitle = usePostTitle();
  const [title, setTitle] = useState(defaultTitle);
  const [updating, setUpdating] = useState(false);
  const [bannerCid, setBannerCid] = useState(post.bannerCid);
  const [selectedLabels, setSelectedLabels] = useState(post.labels || []);
  const postType = useDetailType();
  const { provideContext, reloadPost } = useArticleActions();

  const [isSetBanner, setIsSetBanner] = useState(!!post.bannerCid);
  useEffect(() => {
    if (!isSetBanner) {
      setBannerCid(null);
    }
  }, [isSetBanner]);

  const editPost = useCallback(
    async (content, contentType, realAddress) => {
      return await provideContext(
        post,
        {
          title,
          content,
          contentType,
          bannerCid,
          labels: selectedLabels,
        },
        getRealField(realAddress),
      );
    },
    [post, bannerCid, title, selectedLabels, provideContext],
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
        <MaybeSimaEditInput
          editContent={post.content || ""}
          editContentType={post.contentType}
          onFinishedEdit={async (reload) => {
            if (reload) {
              await reloadPost();
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
