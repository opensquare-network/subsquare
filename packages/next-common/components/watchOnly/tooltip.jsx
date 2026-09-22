import styled, { css } from "styled-components";
import Tooltip from "next-common/components/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

// Disabled buttons do not emit pointer events, so the wrapper is the hover
// target of the tooltip. `display: grid` keeps the wrapper block-wide with its
// child stretched, so it does not shrink buttons inside flex layouts.
const TriggerWrapper = styled.div`
  display: grid;

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
// watch-only; `watchOnlyContent` replaces the hint for non-tx buttons.
export default function WatchOnlyTooltip({
  children,
  content,
  watchOnlyContent = WATCH_ONLY_TOOLTIP_TEXT,
}) {
  const isWatchOnly = useIsWatchOnly();

  if (isWatchOnly) {
    return (
      <Tooltip content={watchOnlyContent}>
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
