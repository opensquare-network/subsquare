import styled, { css } from "styled-components";
import Tooltip from "next-common/components/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

// Disabled buttons do not emit pointer events, so the wrapper is the hover
// target of the tooltip.
const TriggerWrapper = styled.div`
  display: inline-block;

  button:disabled,
  [disabled] {
    pointer-events: none;
  }

  ${(p) =>
    p.watchOnly &&
    css`
      cursor: not-allowed;
    `}
`;

// Shows `content`, or the watch-only hint when the connected account is
// watch-only.
export default function WatchOnlyTooltip({ children, content }) {
  const isWatchOnly = useIsWatchOnly();

  if (isWatchOnly) {
    return (
      <Tooltip content={WATCH_ONLY_TOOLTIP_TEXT}>
        <TriggerWrapper watchOnly>{children}</TriggerWrapper>
      </Tooltip>
    );
  }

  return content ? (
    <Tooltip content={content}>
      <TriggerWrapper>{children}</TriggerWrapper>
    </Tooltip>
  ) : (
    children
  );
}
