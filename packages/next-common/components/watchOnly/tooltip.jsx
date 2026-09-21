import styled from "styled-components";
import Tooltip from "next-common/components/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

// Disabled buttons do not emit pointer events, so let the wrapper be the hover
// target of the tooltip.
const TriggerWrapper = styled.div`
  display: inline-block;
  cursor: not-allowed;

  button {
    pointer-events: none;
  }
`;

export default function WatchOnlyTooltip({ children, content }) {
  const isWatchOnly = useIsWatchOnly();

  if (!isWatchOnly) {
    return children;
  }

  return (
    <Tooltip content={content || WATCH_ONLY_TOOLTIP_TEXT}>
      <TriggerWrapper>{children}</TriggerWrapper>
    </Tooltip>
  );
}
