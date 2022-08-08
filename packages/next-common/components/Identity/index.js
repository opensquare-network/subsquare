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
  .VERIFIED,
  VERIFIED_LINKED {
    path:first-child {
      fill: ${(props) => props.theme.secondaryGreen500};
    }
    path:last-child {
      fill: ${(props) => props.theme.textContrast};
    }
  }

  .NOT_VERIFIED,
  .NOT_VERIFIED_LINKED {
    path:first-child {
      fill: ${(props) => props.theme.grey300Border};
    }
    path:last-child {
      fill: ${(props) => props.theme.grey400Border};
    }
  }

  .ERRONEOUS,
  .ERRONEOUS_LINKED {
    path:first-child {
      fill: ${(props) => props.theme.secondaryRed500};
    }
    path:last-child {
      fill: ${(props) => props.theme.textContrast};
    }
  }
`;

const Display = styled.div`
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  ${(p) =>
    p.maxWidth
      ? css`
          max-width: ${p.maxWidth}px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
      : css`
          word-break: break-all;
        `}
`;

export default function Identity({ identity, fontSize = 14, maxWidth }) {
  if (!identity || identity?.info?.status === "NO_ID") {
    return null;
  }

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper>
      <IdentityIcon identity={identity} />
      {maxWidth ? (
        <Tooltip content={displayName}>
          <div>
            <Display fontSize={fontSize} maxWidth={maxWidth}>
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
