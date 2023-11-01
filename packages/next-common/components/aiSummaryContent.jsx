import { LinkChatgpt } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "next-common/context/post";

export default function AISummaryContent() {
  const post = usePost();

  return (
    <div>
      <MarkdownPreviewer content={post.aiSummaryContent} />

      <p className="text14Medium text-textTertiary flex items-center">
        Powered by
        <span className="ml-2">
          <LinkChatgpt className="mr-1 inline-flex w-5 h-5 [&_path]:fill-textTertiary" />
          OpenAI
        </span>
      </p>
    </div>
  );
}
