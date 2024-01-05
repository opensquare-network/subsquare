import React, { useEffect, useRef, useState } from "react";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "../../../context/post";
import { cn } from "next-common/utils";
import GhostButton from "next-common/components/buttons/ghostButton";
import { sanitizeHtml } from "next-common/utils/post/sanitizeHtml";
import "@osn/previewer/styles.css";

const collapsedHeight = 640;
const moreLessHeightThreshold = 2000;

export default function PostContent() {
  const post = usePost();
  const ref = useRef(null);
  const [showToggleButton, setShowToggleButton] = useState(false);
  // assume is long content by default to AVOID flicker
  const [postContentCollapsed, setPostContentCollapsed] = useState(true);

  useEffect(() => {
    const shouldCollapse =
      ref.current?.clientHeight >= collapsedHeight &&
      ref.current?.scrollHeight > moreLessHeightThreshold;

    setPostContentCollapsed(shouldCollapse);
    setShowToggleButton(shouldCollapse);
  }, [ref]);

  const content = sanitizeHtml(post.content);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col",
        "relative",
        postContentCollapsed && "max-h-[640px] overflow-hidden",
      )}
    >
      {post.contentType === "markdown" && (
        <MarkdownPreviewer content={content || ""} />
      )}
      {post.contentType === "html" && <HtmlPreviewer content={content || ""} />}

      {showToggleButton && (
        <div
          className={cn(
            "flex justify-center",
            "absolute bottom-0 right-0 left-0",
            !postContentCollapsed && "!static",
            postContentCollapsed
              ? "pt-12 pb-4 bg-gradient-to-b from-transparent via-neutral100-80 to-neutral100"
              : "mt-4",
          )}
        >
          <GhostButton
            small
            onClick={() => {
              setPostContentCollapsed(!postContentCollapsed);
            }}
          >
            Show {postContentCollapsed ? "More" : "Less"}
          </GhostButton>
        </div>
      )}
    </div>
  );
}
