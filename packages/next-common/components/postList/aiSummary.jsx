import { SystemAiSummary } from "@osn/icons/subsquare";
import DesktopOnly from "../responsive/desktopOnly";
import { MarkdownPreviewer } from "@osn/previewer";
import * as HoverCard from "@radix-ui/react-hover-card";
import { cn } from "next-common/utils";

export default function PostListAISummary({ data }) {
  const content = data?.contentSummary?.summary;

  if (!content) {
    return null;
  }

  return (
    <DesktopOnly>
      <div className="flex items-center max-sm:hidden">
        <HoverCard.Root openDelay={0} closeDelay={100}>
          <HoverCard.Trigger>
            <SystemAiSummary className="w-4 h-4 text-textTertiary hover:text-textSecondary hover:cursor-pointer stroke-current stroke-[0.5]" />
          </HoverCard.Trigger>

          <HoverCard.Portal>
            <HoverCard.Content
              side="right"
              sideOffset={0}
              align="end"
              className="pl-2 z-50"
            >
              <MarkdownPreviewer
                content={content}
                className={cn(
                  "max-w-[480px]",
                  "!bg-neutral100 shadow-200",
                  "px-4 py-3 rounded-lg",
                  "border border-neutral300",
                )}
              />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </div>
    </DesktopOnly>
  );
}
