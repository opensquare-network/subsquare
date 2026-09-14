import React, { useMemo } from "react";
import { HtmlPreviewer, renderMentionIdentityUserPlugin } from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import { prettyHTML } from "next-common/utils/viewfuncs";
import correctionIpfsEndpointPlugin from "next-common/utils/previewerPlugins/correctionIpfsEndpoint";
import { buildDiffHtml } from "next-common/sima/utils/htmlVersionDiff";

export default function HtmlVersionedDiffContent({ content, previousContent }) {
  const diffHtml = useMemo(() => {
    if (typeof document === "undefined") {
      return null;
    }
    try {
      return buildDiffHtml(previousContent, content);
    } catch {
      return null;
    }
  }, [content, previousContent]);

  const plugins = [
    renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
      targetElement: { tag: "span" },
    }),
    correctionIpfsEndpointPlugin(),
  ];

  if (diffHtml === null) {
    return (
      <HtmlPreviewer content={prettyHTML(content || "")} plugins={plugins} />
    );
  }

  return <HtmlPreviewer content={diffHtml} plugins={plugins} />;
}
