import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import PolkassemblyActions from "../polkassembly/actions";
import clsx from "clsx";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";
import { LinkPolkassembly } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { useDetailType } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import CommentItemTemplate from "next-common/components/comment/itemTemplate";
import { useState } from "react";

export default function PolkassemblyCommentItem({
  data: comment,
  isSecondLevel,
}) {
  const type = useDetailType();
  const post = usePost();
  const [folded, setFolded] = useState(true);

  return (
    <CommentItemTemplate
      data={comment}
      isSecondLevel={isSecondLevel}
      folded={folded}
      setFolded={setFolded}
      user={<PolkassemblyUser user={comment.author} />}
      from={
        <Tooltip content="Post from Polkassembly">
          <ExternalLink
            href={`${getPolkassemblyLink(type, post)}#${comment.id}`}
            externalIcon={false}
          >
            <LinkPolkassembly
              className={clsx(
                "w-4 h-4",
                "[&_path]:fill-textTertiary",
                "[&_path]:hover:fill-textSecondary",
              )}
            />
          </ExternalLink>
        </Tooltip>
      }
      content={
        <MarkdownPreviewer
          content={comment.content}
          plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
        />
      }
      actions={
        !isSecondLevel && <PolkassemblyActions reactions={comment.reactions} />
      }
      renderReply={(reply) => (
        <PolkassemblyCommentItem key={reply.id} data={reply} isSecondLevel />
      )}
    />
  );
}
