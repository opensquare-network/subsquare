import { useCallback, useState } from "react";
import Input from "next-common/components/input";
import EditInput from "../editInput";
import nextApi from "next-common/services/nextApi";
import { useMountedState } from "react-use";
import { usePost, usePostTitle } from "next-common/context/post";
import { useDetailType } from "next-common/context/page";
import FormItem from "next-common/components/form/item";
import { getContentField } from "next-common/utils/sima/utils";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";

export default function SimaPostEdit({ setIsEdit, updatePost }) {
  const type = useDetailType();
  const post = usePost();
  const defaultTitle = usePostTitle();
  const [title, setTitle] = useState(defaultTitle);
  const [updating, setUpdating] = useState(false);
  const signSimaMessage = useSignSimaMessage();

  const editPost = useCallback(
    async (content, contentType) => {
      const entity = {
        action: "provide_context",
        indexer: {
          pallet: "referenda",
          object: "referendumInfoFor",
          proposed_height: 21077078,
          id: 834,
        },
        title,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);

      return await nextApi.post("sima/referenda", data);
    },
    [type, post, title, signSimaMessage],
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
