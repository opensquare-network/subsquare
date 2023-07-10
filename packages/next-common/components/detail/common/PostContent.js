import React from "react";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "../../../context/post";

export default function PostContent() {
  const post = usePost();

  if (post.contentType === "markdown") {
    return (
      <MarkdownPreviewer
        className="prose max-w-full"
        content={post.content || ""}
      />
    );
  } else if (post.contentType === "html") {
    return (
      <HtmlPreviewer
        className="prose max-w-full"
        content={post.content || ""}
      />
    );
  }
}
