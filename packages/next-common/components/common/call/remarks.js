import { hexIsValidUTF8 } from "next-common/utils/utf8validate";
import { hexToString } from "@polkadot/util";
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

function isRemark(section, method) {
  return "system" === section && ["remark", "remarkWithEvent"].includes(method);
}

function findRemarkCalls(call) {
  const { section, method, args } = call || {};
  if (isRemark(section, method)) {
    return [call];
  }

  if (
    "utility" === section &&
    ["batch", "forceBatch"].includes(method) &&
    args
  ) {
    const calls = args[0].value;
    return calls.filter((call) => isRemark(call.section, call.method));
  }

  return [];
}

function extractRemarks(call = {}) {
  const remarkCalls = findRemarkCalls(call);
  const remarks = [];
  for (const call of remarkCalls) {
    const value = call.args[0].value;
    if (hexIsValidUTF8(value)) {
      remarks.push(hexToString(value));
    }
  }

  return remarks;
}

export default function extractRemarkMetaFields(call = {}) {
  let remarks = extractRemarks(call);
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
