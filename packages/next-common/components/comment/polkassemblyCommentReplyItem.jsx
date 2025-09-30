import { useCallback, useState } from "react";
import { useMountedState } from "react-use";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import nextApi from "next-common/services/nextApi";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import CommentItemTemplate from "next-common/components/comment/itemTemplate";
import { CommentProvider, useComment } from "./context";
import CommentUser from "./user";
import PolkassemblyCommentReplyActions from "../polkassembly/polkassemblyCommentReplyActions";
import { prettyHTML } from "next-common/utils/viewfuncs";
import EditInput from "../editInput";
import { useRootCommentContext } from "./rootComment";

function PolkassemblyCommentReplyItemImpl() {
  const isMounted = useMountedState();
  const comment = useComment();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = useCallback(
    async (content, contentType) => {
      return await nextApi.patch(
        `polkassembly-comments/replies/${comment._id}`,
        {
          content,
          contentType,
        },
      );
    },
    [comment._id],
  );

  const { reloadRootComment } = useRootCommentContext();

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
              onFinishedEdit={async (reload) => {
                if (isMounted()) {
                  setIsEdit(false);
                }
                if (reload) {
                  await reloadRootComment();
                }
              }}
              update={update}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </>
      }
      actions={<PolkassemblyCommentReplyActions setIsEdit={setIsEdit} />}
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
