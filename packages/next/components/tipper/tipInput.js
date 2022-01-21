import styled from "styled-components";

const Wrapper = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
`;

const Input = styled.input`
  all: unset;
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

export default function TipInput({ symbol, value, setValue = () => {} }) {
  return (
    <Wrapper>
      <Input
        min={0}
        type="number"
        placeholder="0.00"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Unit>{symbol}</Unit>
    </Wrapper>
  );
}
