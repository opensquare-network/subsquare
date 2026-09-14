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
import HtmlVersionedDiffContent from "next-common/sima/components/htmlVersionedDiffContent";

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

function PlainVersionedContent({ item }) {
  if (item?.contentType === "html") {
    return <HtmlVersionedContent content={item.content} />;
  }

  return <MarkdownVersionedContent content={item.content} />;
}

// Cross-format versions (markdown -> html / html -> markdown) are rendered as
// a whole-text replacement: the previous content is all deleted, and the
// current content is all inserted.
function CrossFormatVersionedContent({ item, previousItem }) {
  return (
    <div className="flex flex-col gap-3">
      <del className="block bg-red100 rounded-sm px-2 py-1 no-underline">
        <PlainVersionedContent item={previousItem} />
      </del>
      <ins className="block bg-green100 rounded-sm px-2 py-1 no-underline">
        <PlainVersionedContent item={item} />
      </ins>
    </div>
  );
}

/**
 * Renders one version content by (current contentType, previous contentType):
 *   1. markdown -> markdown : supported, embedded markdown diff
 *   2. markdown -> html     : cross-format, whole previous deleted + current inserted
 *   3. html     -> markdown : cross-format, whole previous deleted + current inserted
 *   4. html     -> html     : block aligned diff, word level inside modified blocks
 */
function VersionedContent({ item, previousItem }) {
  const currentIsHtml = item?.contentType === "html";
  const previousIsHtml = previousItem?.contentType === "html";

  // No previous version, render current content directly.
  if (!previousItem) {
    return <PlainVersionedContent item={item} />;
  }

  // Case 1: markdown -> markdown, embedded markdown diff.
  if (!currentIsHtml && !previousIsHtml) {
    return (
      <MarkdownVersionedContent
        content={item.content}
        previousContent={previousItem.content}
      />
    );
  }

  // Case 4: html -> html, block aligned diff.
  if (currentIsHtml && previousIsHtml) {
    return (
      <HtmlVersionedDiffContent
        content={item.content}
        previousContent={previousItem.content}
      />
    );
  }

  // Cases 2 & 3: cross-format, whole-text replacement.
  return (
    <CrossFormatVersionedContent item={item} previousItem={previousItem} />
  );
}

export function CommentVersionView({ item, version, previousItem }) {
  const time = dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss");
  const timeLabel = version === 1 ? "Created at" : "Edited at";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text12Medium text-textTertiary">
          {timeLabel} {time}
        </span>
        <ExternalLink
          href={getStorageLink(item.cid)}
          externalIcon={false}
          title={item.cid}
          className="text-textTertiary hover:text-textSecondary"
        >
          <LinkIpfs className="w-4 h-4" />
        </ExternalLink>
      </div>
      <div>
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
