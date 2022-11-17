import styled from "styled-components";

const ThirdPartyLink = styled.a`
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

export const SubscanLinkWrapper = styled(ThirdPartyLink)`
  svg:first-child {
    path:first-child {
      fill: ${(props) => props.theme.grey200Border};
    }
    path:last-child {
      fill: ${(props) => props.theme.grey400Border};
    }
  }
  &:hover {
    svg:first-child {
      display: none;
    }
    svg:last-child {
      path:first-child {
        fill: ${(props) => props.theme.grey200Border};
      }
    }
  }
`;

export default ThirdPartyLink;
