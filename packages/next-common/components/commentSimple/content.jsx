import React from "react";
import {
  MarkdownPreviewer,
  HtmlPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "../IdentityOrAddr";
import { prettyHTML } from "../../utils/viewfuncs";

export default function CommentContent({ data }) {
  if (data.contentType === "markdown") {
    return (
      <MarkdownPreviewer
        content={data.content || ""}
        plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
        maxLines={2}
      />
    );
  }

  if (data.contentType === "html") {
    return (
      <HtmlPreviewer
        content={prettyHTML(data.content)}
        plugins={[
          renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
            targetElement: { tag: "span" },
          }),
        ]}
        maxLines={2}
      />
    );
  }

  return null;
}
