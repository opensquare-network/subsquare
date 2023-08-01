import React, { useEffect, useRef, useState } from "react";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "../../../context/post";
import clsx from "clsx";
import GhostButton from "next-common/components/buttons/ghostButton";

const collapsedHeight = 640;

export default function PostContent() {
  const post = usePost();
  const ref = useRef(null);
  const [showToggleButton, setShowToggleButton] = useState(false);
  // assume is long content by default to AVOID flicker
  const [postContentCollapsed, setPostContentCollapsed] = useState(true);

  useEffect(() => {
    const shouldCollapse = ref.current?.clientHeight >= collapsedHeight;
    setShowToggleButton(shouldCollapse);
  }, [ref]);

  return (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col",
        "relative",
        postContentCollapsed && "max-h-[640px] overflow-hidden",
      )}
    >
      {post.contentType === "markdown" && (
        <MarkdownPreviewer content={post.content || ""} />
      )}
      {post.contentType === "html" && (
        <HtmlPreviewer content={post.content || ""} />
      )}

      {showToggleButton && (
        <div
          className={clsx(
            "flex justify-center",
            "absolute bottom-0 right-0 left-0",
            !postContentCollapsed && "!static",
            postContentCollapsed
              ? "pt-12 bg-gradient-to-b from-transparent to-neutral100"
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
