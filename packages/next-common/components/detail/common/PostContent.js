import React, { useEffect, useRef, useState } from "react";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "../../../context/post";
import { cn } from "next-common/utils";
import GhostButton from "next-common/components/buttons/ghostButton";
import { sanitizeHtml } from "next-common/utils/post/sanitizeHtml";
import { marked } from "marked";

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

  let content;
  if (post.contentType === "markdown") {
    let postContent = post.content;

    if (post.dataSource === "polkassembly") {
      postContent = marked(post.content || "", { breaks: true });

      // strip all inline attributes
      postContent = sanitizeHtml(postContent || "")
        // fallback '&gt;' to '>' for markdown blockquote
        .replaceAll("&gt;", ">");
    }

    content = <MarkdownPreviewer content={postContent} />;
  } else if (post.contentType === "html") {
    content = <HtmlPreviewer content={sanitizeHtml(post.content || "")} />;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col",
        "relative",
        postContentCollapsed && "max-h-[640px] overflow-hidden",
      )}
    >
      {content}

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
