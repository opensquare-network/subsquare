import styled from "styled-components";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  margin-bottom: 24px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  :not(:last-child) {
    border-bottom: 1px solid #ebeef4;
  }
`;

const Label = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  padding: 12px 0;
  width: 128px;
  flex: 0 0 128px;
  text-transform: capitalize;
`;

const Content = styled.div`
  padding: 12px 0;
  word-break: break-all;
  flex: 1 1 auto;
`;

export default function Metadata({ data }) {
  return (
    <Wrapper>
      <Title>Metadata</Title>
      {(data || []).map((item, index) => (
        <Item key={index}>
          <Label>{item[0]}</Label>
          <Content>{item[1]}</Content>
        </Item>
      ))}
    </Wrapper>
  );
}
