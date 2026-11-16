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

// A watch-only account cannot sign at all, which outranks any reason a caller
// passes in `content`: such an account always sees the watch-only hint.
// `content` is therefore only shown while the connected account can sign.
export default function WatchOnlyTooltip({ children, content }) {
  const isWatchOnly = useIsWatchOnly();
  const tooltipContent = isWatchOnly ? WATCH_ONLY_TOOLTIP_TEXT : content;

  if (!tooltipContent) {
    return children;
  }

  return (
    <Tooltip content={tooltipContent}>
      <TriggerWrapper watchOnly={isWatchOnly}>{children}</TriggerWrapper>
    </Tooltip>
  );
}
