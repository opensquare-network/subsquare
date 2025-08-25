import React from "react";
import { MarkdownPreviewer } from "@osn/previewer";
import styled from "styled-components";
import { cn } from "next-common/utils";
import ToggleCollapsed from "next-common/toggleCollapsed";

const RemarkWrapper = styled.div`
  .markdown-body {
    color: inherit;
    word-break: break-word;
  }
`;

export default function extractRemarkMetaFields(remarks) {
  const multipleRemark = remarks.length > 1;

  return remarks?.map((item, index) => {
    const key = `Remark ${multipleRemark ? index + 1 : ""}`;

    return [
      key,
      <div
        key={key}
        className={cn("flex overflow-x-auto", "max-sm:flex-col max-sm:gap-2")}
      >
        <RemarkWrapper>
          <ToggleCollapsed collapsedHeight={300} moreLessHeightThreshold={800}>
            <MarkdownPreviewer content={item || ""} />
          </ToggleCollapsed>
        </RemarkWrapper>
      </div>,
    ];
  });
}
