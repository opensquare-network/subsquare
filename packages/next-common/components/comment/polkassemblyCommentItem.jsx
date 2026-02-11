import {
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import PolkassemblyCommentActions from "../polkassembly/commentActions";
import { useDetailType } from "next-common/context/page";
import CommentItemTemplate from "next-common/components/comment/itemTemplate";
import { useEffect, useState } from "react";
import { CommentProvider, useComment } from "./context";
import PolkassemblyCommentUser from "./polkassemblyUser";
import { useChain } from "next-common/context/chain";
import { ensurePolkassemblyRelativeLink } from "next-common/utils/polkassembly/ensurePolkassemblyRelativeLink";
import { PolkassemblyCommentReplyItem } from "./polkassemblyCommentReplyItem";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import PolkassemblyActions from "../polkassembly/actions";
import { PolkassemblyCommentSource } from "./commentSource";
import useRouterAnchor from "next-common/utils/hooks/useRouterAnchor";

function PolkassemblyCommentItemImpl({ isSecondLevel }) {
  const chain = useChain();
  const comment = useComment();
  const type = useDetailType();

  const [showReplies, setShowReplies] = useState(false);

  const { hasAnchor: hasRouterAnchor } = useRouterAnchor();
  useEffect(() => {
    if (hasRouterAnchor) {
      setShowReplies(true);
    }
  }, [hasRouterAnchor]);

  // eslint-disable-next-line react-hooks/immutability
  comment.content = ensurePolkassemblyRelativeLink(comment.content, chain);

  let actionsComponent = null;
  if (type === detailPageCategory.PA_POST) {
    actionsComponent = <PolkassemblyActions reactions={comment.reactions} />;
  } else {
    actionsComponent = (
      <PolkassemblyCommentActions
        reactions={comment.reactions}
        setShowReplies={setShowReplies}
      />
    );
  }

  return (
    <CommentItemTemplate
      isSecondLevel={isSecondLevel}
      showReplies={showReplies}
      setShowReplies={setShowReplies}
      user={<PolkassemblyCommentUser user={comment.author} />}
      commentSource={<PolkassemblyCommentSource />}
      content={
        <MarkdownPreviewer
          content={comment.content || ""}
          plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
          markedOptions={{
            breaks: true,
          }}
        />
      }
      actions={actionsComponent}
      renderReplyItem={(reply) => (
        <PolkassemblyReplyItem key={reply.id || reply._id} data={reply} />
      )}
    />
  );
}

function PolkassemblyReplyItem({ data }) {
  if (data.comment_source === "subsquare-reply-to-polkassembly-comment") {
    return <PolkassemblyCommentReplyItem data={data} />;
  }

  return <PolkassemblyCommentItem data={data} isSecondLevel />;
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
