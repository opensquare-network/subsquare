import styled from "styled-components";

export const RightBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 24px;
  top: 0;
  width: 300px;
  margin-top: 8px !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
`;
