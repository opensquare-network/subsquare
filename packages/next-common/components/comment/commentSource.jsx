import { useIsUniversalPostComments } from "next-common/hooks/usePostComments";
import Tooltip from "../tooltip";
import ExternalLink from "../externalLink";
import { getPolkassemblyLink } from "next-common/utils/polkassembly";
import { LinkPolkassembly, LinkSubsquare } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useComment } from "./context";
import { useDetailType } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";

export default function CommentSource() {
  const comment = useComment();
  const isUniversalComments = useIsUniversalPostComments();

  if (!isUniversalComments) {
    return null;
  }

  if (comment?.comment_source === "polkassembly") {
    return <PolkassemblyCommentSource />;
  }

  return <SubsquareCommentSource />;
}

export function SubsquareCommentSource() {
  return (
    <Tooltip content="Comment from SubSquare" className="ml-2">
      <LinkSubsquare className="w-4 h-4 [&_path]:fill-textTertiary" />
    </Tooltip>
  );
}

export function PolkassemblyCommentSource() {
  const { usePolkassemblyBackupData } = useChainSettings();

  const comment = useComment();
  const type = useDetailType();
  const post = usePost();

  if (!usePolkassemblyBackupData) {
    return (
      <Tooltip content="Comment from Polkassembly" className="ml-2">
        <LinkPolkassembly
          className={cn(
            "w-4 h-4",
            "[&_path]:fill-textTertiary",
            "[&_path]:hover:fill-textSecondary",
          )}
        />
      </Tooltip>
    );
  }

  return (
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
  );
}
