import React from "react";
import styled, { css } from "styled-components";
import IdentityIcon from "./identityIcon";
import Flex from "../styled/flex";
import Tooltip from "../tooltip";

const Wrapper = styled(Flex)`
  display: flex;
  align-items: center;

  svg {
    margin-right: 4px;
  }
`;

const Display = styled.div`
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(p) =>
    p.width &&
    css`
      width: ${p.width}px;
      overflow-x: hidden;
    `}
`;

export default function Identity({ identity, fontSize = 14, width }) {
  if (!identity || identity?.info?.status === "NO_ID") {
    return null;
  }

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper>
      <IdentityIcon identity={identity} />
      {width ? (
        <Tooltip content={displayName}>
          <div>
            <Display fontSize={fontSize} width={width}>
              {displayName}
            </Display>
          </div>
        </Tooltip>
      ) : (
        <Display fontSize={fontSize}>{displayName}</Display>
      )}
    </Wrapper>
  );
}
