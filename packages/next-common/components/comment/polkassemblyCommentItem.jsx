import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import PolkassemblyActions from "../polkassembly/actions";
import { cn } from "next-common/utils";
import { LinkPolkassembly } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { useDetailType } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import CommentItemTemplate from "next-common/components/comment/itemTemplate";
import { useState } from "react";
import { useIsUniversalPostComments } from "next-common/hooks/usePostComments";
import { CommentProvider, useComment } from "./context";
import PolkassemblyCommentUser from "./polkassemblyUser";

function PolkassemblyCommentItemImpl({ isSecondLevel }) {
  const comment = useComment();
  const type = useDetailType();
  const post = usePost();
  const [showReplies, setShowReplies] = useState(false);
  const isUniversalComments = useIsUniversalPostComments();

  return (
    <CommentItemTemplate
      isSecondLevel={isSecondLevel}
      showReplies={showReplies}
      setShowReplies={setShowReplies}
      user={<PolkassemblyCommentUser user={comment.author} />}
      commentSource={
        isUniversalComments && (
          <Tooltip content="Comment from Polkassembly" className="ml-2">
            <ExternalLink
              href={`${getPolkassemblyLink(type, post)}#${comment.id}`}
              externalIcon={false}
            >
              <LinkPolkassembly
                className={cn(
                  "w-4 h-4",
                  "[&_path]:fill-textTertiary",
                  "[&_path]:hover:fill-textSecondary",
                )}
              />
            </ExternalLink>
          </Tooltip>
        )
      }
      content={
        <MarkdownPreviewer
          content={comment.content || ""}
          plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
          markedOptions={{
            breaks: true,
          }}
        />
      }
      actions={
        !isSecondLevel && <PolkassemblyActions reactions={comment.reactions} />
      }
      renderReplyItem={(reply) => (
        <PolkassemblyCommentItem key={reply.id} data={reply} isSecondLevel />
      )}
    />
  );
}

export default function PolkassemblyCommentItem({
  data,
  isSecondLevel,
  ...props
}) {
  return (
    <CommentProvider comment={data}>
      <PolkassemblyCommentItemImpl isSecondLevel={isSecondLevel} {...props} />
    </CommentProvider>
  );
}
