import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import CommentItemTemplate from "next-common/components/comment/itemTemplate";
import { CommentProvider, useComment, useSetComment } from "./context";
import CommentUser from "./user";
import { useState } from "react";
import PolkassemblyCommentReplyActions from "../polkassembly/polkassemblyCommentReplyActions";
import { prettyHTML } from "next-common/utils/viewfuncs";
import EditInput from "../editInput";
import { useMountedState } from "react-use";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

function PolkassemblyCommentReplyItemImpl() {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const comment = useComment();
  const setComment = useSetComment();
  const [isEdit, setIsEdit] = useState(false);

  const update = async (content, contentType) => {
    return await nextApi.patch(`polkassembly-comments/replies/${comment._id}`, {
      content,
      contentType,
    });
  };

  const reloadComment = async () => {
    const { result, error } = await nextApi.fetch(
      `polkassembly-comments/replies/${comment._id}`,
    );
    if (error) {
      dispatch(newErrorToast(error.message));
      return;
    }

    setComment(result);
  };

  return (
    <CommentItemTemplate
      isSecondLevel={true}
      user={<CommentUser author={comment.author} />}
      content={
        <>
          {!isEdit && (
            <>
              {comment.contentType === "markdown" && (
                <MarkdownPreviewer
                  content={comment.content || ""}
                  plugins={[
                    renderMentionIdentityUserPlugin(<IdentityOrAddr />),
                  ]}
                  markedOptions={{
                    breaks: true,
                  }}
                />
              )}
              {comment.contentType === "html" && (
                <HtmlPreviewer
                  content={prettyHTML(comment.content)}
                  plugins={[
                    renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
                      targetElement: { tag: "span" },
                    }),
                  ]}
                />
              )}
            </>
          )}
          {isEdit && (
            <EditInput
              editContent={comment.content}
              editContentType={comment.contentType}
              onFinishedEdit={async () => {
                if (isMounted()) {
                  setIsEdit(false);
                }
              }}
              update={update}
              loading={false}
              setLoading={() => {}}
            />
          )}
        </>
      }
      actions={
        <PolkassemblyCommentReplyActions
          reloadComment={reloadComment}
          setIsEdit={setIsEdit}
        />
      }
    />
  );
}

export function PolkassemblyCommentReplyItem({ data }) {
  return (
    <CommentProvider comment={data}>
      <PolkassemblyCommentReplyItemImpl data={data} />
    </CommentProvider>
  );
}
