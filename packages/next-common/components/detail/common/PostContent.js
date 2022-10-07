import React from "react";
import { useSelector } from "react-redux";
import { postSelector } from "../../../store/reducers/postSlice";
import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";

export default function PostContent() {
  const post = useSelector(postSelector);

  if (post.contentType === "markdown") {
    return <MarkdownPreviewer content={post.content} />
  } else if (post.contentType === "html") {
    return <HtmlPreviewer content={post.content} />
  }
}
