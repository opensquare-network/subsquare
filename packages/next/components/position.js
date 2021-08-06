import styled, { css } from "styled-components";

const Wrapper = styled.div`
  position: sticky;
  top: 26px;
`;

const Item = styled.div`
  height: 36px;
  border-left: 3px solid #e0e4eb;
  padding-left: 12px;
  line-height: 36px;
  color: #506176;
  font-weight: 500;
  ${(p) =>
    p.active &&
    css`
      color: #6848ff;
      border-color: #6848ff;
    `}
`;

export default function Position() {
  return (
    <Wrapper>
      <Item active>Subject</Item>
      <Item>On-chain Info</Item>
      <Item>Timeline</Item>
      <Item>Comment</Item>
    </Wrapper>
  );
}
