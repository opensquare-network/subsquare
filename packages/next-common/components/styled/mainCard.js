import styled from "styled-components";

const MainCard = styled.div`
  margin-right: 332px;
  overflow: hidden;
  flex-grow: 1;

  > :not(:first-child) {
    margin-top: 16px;
  }

  @media screen and (max-width: 1024px) {
    max-width: 852px;
    margin: 0 auto;
  }
`;

export default MainCard;
