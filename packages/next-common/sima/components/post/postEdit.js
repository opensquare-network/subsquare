import { useCallback, useState } from "react";
import { useMountedState } from "react-use";
import Input from "next-common/lib/input";
import EditInput from "next-common/sima/components/editInput";
import { usePost, usePostTitle } from "next-common/context/post";
import FormItem from "next-common/components/form/item";
import { useArticleActions } from "next-common/sima/context/articleActions";

export default function SimaPostEdit({ setIsEdit }) {
  const post = usePost();
  const defaultTitle = usePostTitle();
  const [title, setTitle] = useState(defaultTitle);
  const [updating, setUpdating] = useState(false);
  const { provideContext, reloadPost } = useArticleActions();

  const editPost = useCallback(
    async (content, contentType) => {
      return await provideContext(post, title, content, contentType);
    },
    [post, title, provideContext],
  );

  const isMounted = useMountedState();

  return (
    <div>
      <FormItem label="Title">
        <Input
          disabled={updating}
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormItem>

      <FormItem label="Issue">
        <EditInput
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
