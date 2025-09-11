import { SystemCopy, SystemCopied } from "@osn/icons/subsquare";
import styled from "styled-components";
import copy from "copy-to-clipboard";
import { useState } from "react";
import Tooltip from "./tooltip";

const Wrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
`;

export default function CopyButton({ copyText = "", size = 16 }) {
  const [copied, setCopied] = useState(false);

  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation();
        copy(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      role="button"
    >
      <Tooltip content={copied ? "Copied" : "Copy"} keepTooltipOpenAfterClick>
        {copied ? (
          <SystemCopied
            width={size}
            height={size}
            className="[&_path]:fill-textSecondary [&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary"
          />
        ) : (
          <SystemCopy
            width={size}
            height={size}
            className="[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary [&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary"
          />
        )}
      </Tooltip>
    </Wrapper>
  );
}
