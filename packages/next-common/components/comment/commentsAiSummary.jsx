import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { MarkdownPreviewer } from "@osn/previewer";
import { SystemAiSummary } from "@osn/icons/subsquare";
import { backendApi } from "next-common/services/nextApi";
import { cn } from "next-common/utils";
import { usePost } from "next-common/context/post";
import { usePageProperties } from "next-common/context/page";
import { useSwitchCommentTabs } from "next-common/context/post/switchComment";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { shouldShowCommentsAiSummary } from "next-common/utils/comment";
import Loading from "next-common/components/loading";

async function fetchCommentsAiSummary({ postType, postId }) {
  const { result, error } = await backendApi.post("comments/ai-summary", {
    postType,
    postId,
  });
  if (error) {
    throw new Error(error.message || "Failed to load AI summary");
  }
  return result?.summary || "";
}

// Keep typography consistent with comment content rendered by MarkdownPreviewer
const popupClassName = cn(
  "max-w-[calc(100vw-32px)] md:max-w-[480px]",
  "bg-neutral100 shadow-200",
  "px-4 py-3 rounded-lg",
  "border border-neutral300",
  "text-[14px] font-normal leading-[21px]",
  "max-h-[70vh] overflow-y-auto scrollbar-pretty",
);

function PopupContent({ isLoading, isError, summary }) {
  let content;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center w-full min-w-[120px]">
        <Loading size={16} />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="text-textTertiary">
        Failed to load AI summary, please try again later.
      </div>
    );
  } else if (!summary) {
    content = <div className="text-textTertiary">No AI summary available.</div>;
  } else {
    content = (
      <MarkdownPreviewer content={summary} className="!bg-neutral100" />
    );
  }

  return (
    <div className={popupClassName}>
      <div className="flex items-center gap-2 mb-2">
        <SystemAiSummary className="w-4 h-4 text-textTertiary" />
        <span className="text14Bold text-textPrimary">AI Summary</span>
      </div>
      {content}
    </div>
  );
}

function CommentsAiSummaryPopover({ postType, postId }) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef();

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    return () => cancelClose();
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), 150);
  }, [cancelClose]);

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["comments-ai-summary", postType, postId],
    queryFn: () => fetchCommentsAiSummary({ postType, postId }),
    enabled: open,
    gcTime: Infinity,
    retry: false,
  });

  const handleOpen = useCallback(() => {
    cancelClose();
    setOpen(true);
    if (isError) {
      refetch();
    }
  }, [cancelClose, isError, refetch]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <button
          type="button"
          aria-label="AI Summary"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex items-center"
          onMouseEnter={handleOpen}
          onMouseLeave={scheduleClose}
          onClick={handleOpen}
        >
          <SystemAiSummary className="w-4 h-4 text-textTertiary hover:text-textSecondary cursor-pointer stroke-current stroke-[0.5]" />
        </button>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          className="z-50 outline-none"
          aria-label="AI Summary"
          onMouseEnter={handleOpen}
          onMouseLeave={scheduleClose}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <PopupContent
            isLoading={isLoading && !summary}
            isError={isError && !summary}
            summary={summary}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const directPostTypes = {
  [detailPageCategory.POST]: "post",
  [detailPageCategory.FELLOWSHIP_APPLICATION]: "fellowshipApplication",
};

export default function CommentsAiSummary({ commentsData }) {
  const post = usePost();
  const { type } = usePageProperties();
  const { activeTab } = useSwitchCommentTabs() || {};

  const refToPost = post?.refToPost;
  const postType = refToPost?.postType || directPostTypes[type];
  const postId = refToPost?.postId ? String(refToPost.postId) : post?._id;
  const enoughComments = useMemo(
    () => shouldShowCommentsAiSummary(commentsData?.items, postType),
    [commentsData, postType],
  );
  const show = postType && postId && enoughComments && activeTab !== "evidence";

  if (!show) {
    return null;
  }

  return <CommentsAiSummaryPopover postType={postType} postId={postId} />;
}
