import React, { useMemo } from "react";
import { diffWords } from "diff";
import Popup from "next-common/components/popup/wrapper/Popup";
import { noop } from "lodash-es";
import dayjs from "dayjs";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import { prettyHTML } from "next-common/utils/viewfuncs";
import correctionIpfsEndpointPlugin from "next-common/utils/previewerPlugins/correctionIpfsEndpoint";
import { LinkIpfs } from "@osn/icons/subsquare";
import ExternalLink from "next-common/components/externalLink";
import getStorageLink from "next-common/utils/env/storageLink";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";

function VersionBadge({ version }) {
  return (
    <span
      className="inline-flex h-5 min-w-5 px-1 rounded text12Bold items-center justify-center"
      style={{
        color: getRankColor(0),
        backgroundColor: getRankColor(0, 0.1),
      }}
    >
      {version}
    </span>
  );
}

function MarkdownVersionedContent({ content, previousContent }) {
  const diffParts = useMemo(
    () => (previousContent ? diffWords(previousContent, content || "") : []),
    [previousContent, content],
  );
  const hasDiff = diffParts.some((part) => part.added || part.removed);

  const annotatedContent = useMemo(() => {
    if (!hasDiff) {
      return content || "";
    }
    return diffParts
      .map((part) => {
        if (part.added) {
          return `<ins class="bg-green100 text-textPrimary rounded-sm px-0.5">${part.value}</ins>`;
        }
        if (part.removed) {
          return `<del class="bg-red100 text-textTertiary line-through rounded-sm px-0.5">${part.value}</del>`;
        }
        return part.value;
      })
      .join("");
  }, [diffParts, hasDiff, content]);

  return (
    <MarkdownPreviewer
      content={annotatedContent}
      plugins={[
        renderMentionIdentityUserPlugin(<IdentityOrAddr />),
        correctionIpfsEndpointPlugin(),
      ]}
      markedOptions={{
        breaks: true,
      }}
    />
  );
}

function HtmlVersionedContent({ content }) {
  return (
    <HtmlPreviewer
      content={prettyHTML(content || "")}
      plugins={[
        renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
          targetElement: { tag: "span" },
        }),
        correctionIpfsEndpointPlugin(),
      ]}
    />
  );
}

/**
 * Renders one version content by (current contentType, previous contentType):
 *   1. markdown -> markdown : supported, embedded markdown diff
 *   2. markdown -> html     : not implemented yet, render markdown without diff
 *   3. html     -> markdown : not implemented yet, render html directly
 *   4. html     -> html     : not implemented yet, render html directly
 */
function VersionedContent({ item, previousItem }) {
  const currentIsHtml = item?.contentType === "html";
  const previousIsHtml = previousItem?.contentType === "html";

  // Cases 3 & 4: current version is html, always render html directly.
  if (currentIsHtml) {
    return <HtmlVersionedContent content={item.content} />;
  }

  // Case 2: current markdown but previous html, cross-format diff is not
  // implemented yet, render current markdown without diff.
  if (previousIsHtml) {
    return <MarkdownVersionedContent content={item.content} />;
  }

  // Case 1: markdown -> markdown, embedded markdown diff.
  return (
    <MarkdownVersionedContent
      content={item.content}
      previousContent={previousItem?.content}
    />
  );
}

export function CommentVersionView({ item, version, previousItem }) {
  const time = dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <VersionBadge version={version} />
          <span className="text12Medium text-textTertiary">{time}</span>
        </div>
        <ExternalLink
          href={getStorageLink(item.cid)}
          externalIcon={false}
          title={item.cid}
          className="text-textTertiary hover:text-textSecondary"
        >
          <LinkIpfs className="w-4 h-4" />
        </ExternalLink>
      </div>
      <div className="pl-7">
        <VersionedContent item={item} previousItem={previousItem} />
      </div>
    </div>
  );
}

export default function CommentVersionViewPopup({
  item,
  version,
  previousItem,
  setShow = noop,
}) {
  return (
    <Popup
      title="Comment Version"
      onClose={() => setShow(false)}
      className="w-200 max-w-full"
    >
      <CommentVersionView
        item={item}
        version={version}
        previousItem={previousItem}
      />
    </Popup>
  );
}
