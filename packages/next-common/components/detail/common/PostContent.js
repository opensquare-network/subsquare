import React from "react";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  highlightCodeExtension,
} from "@osn/previewer";
import { sanitizeHtml } from "next-common/utils/post/sanitizeHtml";
import { Marked } from "marked";
import { useChain } from "next-common/context/chain";
import { ensurePolkassemblyRelativeLink } from "next-common/utils/polkassembly/ensurePolkassemblyRelativeLink";
import correctionIpfsEndpointPlugin from "next-common/utils/previewerPlugins/correctionIpfsEndpoint";
import ToggleCollapsed from "next-common/toggleCollapsed";

const marked = new Marked();

marked.use(highlightCodeExtension());

export default function PostContent({ post = {} }) {
  const chain = useChain();
  let content;
  if (post.contentType === "markdown") {
    if (post.dataSource === "polkassembly") {
      let postContent = marked.parse(
        post.polkassemblyContentHtml || post.content || "",
        {
          breaks: true,
        },
      );

      // strip all inline attributes
      postContent = sanitizeHtml(postContent || "");

      postContent = ensurePolkassemblyRelativeLink(postContent, chain);

      content = (
        <HtmlPreviewer
          content={postContent}
          plugins={[correctionIpfsEndpointPlugin()]}
        />
      );
    } else {
      content = (
        <MarkdownPreviewer
          content={post.content}
          markedOptions={{
            breaks: true,
          }}
          plugins={[correctionIpfsEndpointPlugin()]}
        />
      );
    }
  } else if (post.contentType === "html") {
    content = (
      <HtmlPreviewer
        content={sanitizeHtml(post.content || "")}
        plugins={[correctionIpfsEndpointPlugin()]}
      />
    );
  }

  return (
    <ToggleCollapsed>
      {content}
    </ToggleCollapsed>
  );
}

