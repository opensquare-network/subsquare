import React from "react";
import styled, { css } from "styled-components";
import IdentityIcon from "./identityIcon";
import Flex from "../styled/flex";
import Tooltip from "../tooltip";
import { getIdentityDisplay } from "next-common/utils/identity";

const Wrapper = styled(Flex)`
  display: flex;
  align-items: center;

  svg {
    margin-right: 4px;
  }
  .VERIFIED,
  VERIFIED_LINKED {
    path:first-child {
      fill: var(--green500);
    }
    path:last-child {
      fill: var(--textPrimaryContrast);
    }
  }

  .NOT_VERIFIED,
  .NOT_VERIFIED_LINKED {
    path:first-child {
      fill: var(--neutral400);
    }
    path:last-child {
      fill: var(--neutral500);
    }
  }

  .ERRONEOUS,
  .ERRONEOUS_LINKED {
    path:first-child {
      fill: var(--red500);
    }
    path:last-child {
      fill: var(--textPrimaryContrast);
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

  const displayName = getIdentityDisplay(identity);

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
        <Display fontSize={fontSize} maxWidth={maxWidth}>
          {displayName}
        </Display>
      )}
    </Wrapper>
  );
}
