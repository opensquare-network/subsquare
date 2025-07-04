import React, { useState } from "react";
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

function FoldableContent({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-none" : "max-h-[150px]"
        }`}
        style={{
          maxHeight: isExpanded ? "none" : "150px",
        }}
      >
        {children}
      </div>

      {!isExpanded && (
        <div
          className="absolute bottom-0 left-0 right-0 h-12 flex items-end justify-center px-6 pt-12 pb-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 50%, #FFF 100%)",
          }}
        >
          <button
            onClick={() => setIsExpanded(true)}
            className="px-3 py-[6px] text12Medium bg-neutral100 border border-neutral400 rounded-md"
          >
            Show More
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsExpanded(false)}
            className="px-3 py-[6px] text12Medium bg-neutral100 border border-neutral400 rounded-md"
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
}

export default function PostContent({ post = {}, isFold = false }) {
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

  const wrappedContent = <ToggleCollapsed>{content}</ToggleCollapsed>;

  if (!isFold) {
    return wrappedContent;
  }

  return <FoldableContent>{wrappedContent}</FoldableContent>;
}
