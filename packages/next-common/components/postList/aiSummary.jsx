import { SystemAiSummary } from "@osn/icons/subsquare";
import Tooltip from "../tooltip";
import DesktopOnly from "../responsive/desktopOnly";
import { MarkdownPreviewer } from "@osn/previewer";

export default function PostListAISummary({ data }) {
  const content = data?.contentSummary?.summary;

  if (!content) {
    return null;
  }

  return (
    <DesktopOnly>
      <div className="flex items-center max-sm:hidden">
        <Tooltip
          content={
            <MarkdownPreviewer
              className="!text-inherit max-w-4xl"
              content={content}
            />
          }
        >
          <SystemAiSummary className="w-4 h-4 text-textTertiary hover:text-textSecondary hover:cursor-pointer stroke-current stroke-[0.5]" />
        </Tooltip>
      </div>
    </DesktopOnly>
  );
}
