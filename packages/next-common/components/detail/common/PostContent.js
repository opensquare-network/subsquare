import React, { useEffect, useRef, useState } from "react";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  highlightCodeExtension,
} from "@osn/previewer";
import { cn } from "next-common/utils";
import SecondaryButton from "next-common/lib/button/secondary";
import { sanitizeHtml } from "next-common/utils/post/sanitizeHtml";
import { Marked } from "marked";

const marked = new Marked();

marked.use(highlightCodeExtension());

const collapsedHeight = 640;
const moreLessHeightThreshold = 2000;

export default function PostContent({ post = {} }) {
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
      postContent = marked.parse(post.content || "", { breaks: true });

      // strip all inline attributes
      postContent = sanitizeHtml(postContent || "");

      content = <HtmlPreviewer content={postContent} />;
    } else {
      content = (
        <MarkdownPreviewer
          content={postContent}
          markedOptions={{
            breaks: true,
          }}
        />
      );
    }
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
          <SecondaryButton
            size="small"
            onClick={() => {
              setPostContentCollapsed(!postContentCollapsed);
            }}
          >
            Show {postContentCollapsed ? "More" : "Less"}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
