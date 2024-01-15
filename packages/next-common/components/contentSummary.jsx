import { LinkChatgpt } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "next-common/context/post";

export default function ContentSummary() {
  const post = usePost();

  return (
    <div>
      <MarkdownPreviewer content={post.contentSummary?.summary} />

      <div className="mt-4 text12Medium text-textTertiary flex items-center">
        Powered by
        <span className="ml-2">
          <LinkChatgpt className="mr-1 inline-flex w-4 h-4 [&_path]:fill-textTertiary" />
          OpenAI
        </span>
      </div>
    </div>
  );
}
