import React from "react";
import styled from "styled-components";
import Flex from "../styled/flex";
import { Approve, Reject } from "../icons";
const Wrapper = styled.div`
  padding: 10px 0;
  font-size: 12px;
`;

const BarWrapper = styled(Flex)``;

const Bar = styled.div`
  height: 4px;
  background: ${(p) =>
    p.value === true
      ? p.theme.secondaryGreen500
      : p.value === false
      ? p.theme.secondaryRed500
      : p.theme.grey200Border};
  flex-grow: 1;
  :not(:first-child) {
    margin-left: 4px;
  }
  :first-child {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  :last-child {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
`;

const DetailWrapper = styled(Flex)`
  min-height: 14px;
  margin-top: 8px;
  color: ${(props) => props.theme.textSecondary};
  > :not(:first-child) {
    :nth-child(2) {
      margin-left: auto;
    }
    margin-left: 18px;
    display: flex;
    align-items: center;
    > span {
      margin-left: 8px;
    }
  }
`;

export default function Progress({ total, ayes, nays }) {
  const data = [];
  for (let i = 0; i < ayes; i++) data.push(true);
  for (let j = 0; j < nays; j++) data.push(false);
  for (let k = data.length; k < total; k++) data.push(undefined);

  return (
    <Wrapper>
      <BarWrapper>
        {data.map((item, index) => (
          <Bar key={index} value={item} />
        ))}
      </BarWrapper>
      <DetailWrapper>
        <div>{`${ayes}/${total}`}</div>
        <div>
          <div>{`Aye(${ayes})`}</div>
          <Approve />
        </div>
        <div>
          <div>{`Nay(${nays})`}</div>
          <Reject />
        </div>
      </DetailWrapper>
    </Wrapper>
  );
}
