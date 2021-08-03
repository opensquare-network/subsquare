import styled from "styled-components";

import Item from "./item";
import Pagination from "components/pagination";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
    margin: 0 -16px;
    border-radius: 0;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

const Input = styled.div`
  height: 160px;
  background: #f6f7fa;
  margin-top: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Comments({ data }) {
  return (
    <Wrapper>
      <Title>Comment</Title>
      {data.map((item, index) => (
        <Item key={index} data={item} />
      ))}
      <Pagination />
      <Input>Input</Input>
    </Wrapper>
  );
}
