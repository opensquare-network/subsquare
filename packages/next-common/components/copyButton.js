import { SystemCopy, SystemCopied } from "@osn/icons/subsquare";
import styled from "styled-components";
import copy from "copy-to-clipboard";
import { useState } from "react";
import Tooltip from "./tooltip";

const Wrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
  align-items: center;
  width: 16px;
  height: 16px;
`;

export default function CopyButton({ copyText = "" }) {
  const [copied, setCopied] = useState(false);

  return (
    <Wrapper
      onClick={() => {
        copy(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      <Tooltip content={copied ? "Copied" : "Copy"}>
        {copied ? (
          <SystemCopied
            width={16}
            height={16}
            className="[&_path]:fill-textSecondary"
          />
        ) : (
          <SystemCopy
            width={16}
            height={16}
            className="[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary"
          />
        )}
      </Tooltip>
    </Wrapper>
  );
}
