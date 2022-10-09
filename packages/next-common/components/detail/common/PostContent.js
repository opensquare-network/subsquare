import React from "react";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";
import { usePost } from "../../../context/post";

export default function PostContent() {
  const post = usePost();

  if (post.contentType === "markdown") {
    return <MarkdownPreviewer content={post.content} />
  } else if (post.contentType === "html") {
    return <HtmlPreviewer content={post.content} />
  }
}
