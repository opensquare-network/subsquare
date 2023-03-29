import styled from "styled-components";

export const OnlyDesktop = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const OnlyMobile = styled.div`
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
