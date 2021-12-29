import styled from "styled-components";

const Wrapper = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
`;

const Input = styled.input`
  all: unset;
  /* display: block; */
  padding: 12px 16px;
  flex-grow: 1;
`;

const Unit = styled.div`
  padding: 12px 16px;
  background: #f6f7fa;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  border-left: 1px solid #e0e4eb;
`;

export default function TipInput() {
  return (
    <Wrapper>
      <Input type="number" placeholder="0.00" />
      <Unit>PHA</Unit>
    </Wrapper>
  );
}
