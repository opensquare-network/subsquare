import React, { useState } from "react";
import styled from "styled-components";
import Panel from "./styled/panel";
import Caret from "./icons/caret";

const Wrapper = styled(Panel)`
  margin: 16px 0;

  div {
    background: none !important;
  }

  div:last-child {
    border-bottom: none;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-weight: bold;
    font-size: 16px;
  }

  svg {
    cursor: pointer;
  }
`;

const Items = styled.article`
  display: ${(props) => (props.show ? "block" : "none")};
  margin-top: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: start;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef4;
  background-color: white;
`;
const Header = styled.div`
  width: 120px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #1e2134;
  word-break: break-all;

  a {
    color: #1f70c7;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function KVList({ data, title, showFold = true }) {
  if (!data || data?.length === 0) {
    return null;
  }

  let initialFold = false;

  const [fold, setFold] = useState(initialFold);

  const items = (
    <Items show={!fold}>
      {data.map(
        (row, index) =>
          row && (
            <Row key={index}>
              {row.length === 1 && row[0]}
              {row.length === 2 && (
                <>
                  <Header>{row[0]}</Header>
                  <Content>{row[1]}</Content>
                </>
              )}
            </Row>
          )
      )}
    </Items>
  );

  return (
    <Wrapper>
      <Title>
        <span>{title}</span>
        {showFold && (
          <span onClick={() => setFold(!fold)}>
            <Caret size={16} isGrey={true} down={!fold} />
          </span>
        )}
      </Title>
      {items}
    </Wrapper>
  );
}

export default KVList;
