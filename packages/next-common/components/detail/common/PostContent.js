import React, { useEffect, useRef, useState } from "react";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "../../../context/post";
import clsx from "clsx";
import GhostButton from "next-common/components/buttons/ghostButton";

export default function PostContent() {
  const post = usePost();
  const ref = useRef(null);
  const [showCollapse, setShowCollapse] = useState(false);
  // assume is long content by default to avoid flicker
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const shouldCollapse = ref.current?.clientHeight >= 640;
    setShowCollapse(shouldCollapse);
    setCollapsed(shouldCollapse);
  }, [ref]);

  return (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col",
        "relative",
        collapsed && "max-h-[640px] overflow-hidden",
      )}
    >
      {post.contentType === "markdown" && (
        <MarkdownPreviewer content={post.content || ""} />
      )}
      {post.contentType === "html" && (
        <HtmlPreviewer content={post.content || ""} />
      )}

      {!showCollapse && (
        <div
          className={clsx(
            "absolute bottom-0 right-0 left-0",
            !collapsed && "!static",
            collapsed
              ? "pt-12 bg-gradient-to-b from-transparent to-neutral100"
              : "mt-4",
          )}
        >
          <div className="text-center">
            <GhostButton
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            >
              View {collapsed ? "All" : "Less"}
            </GhostButton>
          </div>
        </div>
      )}
    </div>
  );
}
