import styled from "styled-components";

const ThirdPartyLink = styled.a`
  display: inline-flex;
  width: 20px;
  height: 20px;
  overflow: hidden;
`;

export const StatescanLink = styled(ThirdPartyLink)`
  svg:last-child {
    display: none;
  }

  &:hover {
    svg:first-child {
      display: none;
    }

    svg:last-child {
      display: inline-block;
    }
  }
`;

export const DotreasuryLinkWrapper = StatescanLink;

export const SubscanLinkWrapper = styled(ThirdPartyLink)`
  svg {
    path:first-child {
      fill: var(--neutral300);
    }
    path:last-child {
      fill: var(--neutral500);
    }
  }

  svg:last-child {
    display: none;
  }

  &:hover {
    svg:first-child {
      display: none;
    }
    svg:last-child {
      display: inline-block;
    }
  }
`;

export default ThirdPartyLink;
