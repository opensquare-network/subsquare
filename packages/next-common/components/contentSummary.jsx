import { LinkChatgpt } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "next-common/context/post";

export default function ContentSummary() {
  const post = usePost();

  return (
    <div>
      <MarkdownPreviewer content={post.contentSummary?.summary} />
    </div>
  );
}
