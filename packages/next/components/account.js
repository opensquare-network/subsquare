import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

export default function Account({ name }) {
  return (
    <Wrapper>
      <img src="/imgs/icons/avatar.svg" />
      <div>{name}</div>
    </Wrapper>
  );
}
