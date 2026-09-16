import styled from "styled-components";
import { SystemComment } from "@osn/icons/subsquare";

// The search item forces a fill class onto the icon paths.
const CommentIcon = styled(SystemComment)`
  path {
    fill: transparent !important;
    stroke: var(--textTertiary);
  }
`;

export default CommentIcon;
