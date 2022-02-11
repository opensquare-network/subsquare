import React from "react";
import styled from "styled-components";
import User from "next-common/components/user";
import Progress from "./progress";
import Flex from "next-common/components/styled/flex";

const TitleWrapper = styled(Flex)`
  justify-content: space-between;
  min-height: 28px;
  > :last-child {
    display: flex;
    align-items: center;
    color: #506176;
    > img {
      margin-left: 4px;
    }
  }
`;

const ArgsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 28px;

  background: #f6f7fa;
  border-radius: 4px;
`;

const ArgItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 7px 0px;
  > :first-child {
    text-transform: capitalize;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 100%;
    color: #506176;
  }
  > :last-child {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 100%;
    color: #1e2134;
  }
`;

export default function Voting({ data, chain }) {
  return (
    <div>
      <TitleWrapper>
        <User chain={chain} add={data.proposer} fontSize={14} />
        <div>
          <div>{data.method}</div>
          <img src="/imgs/icons/approve.svg" alt="" />
        </div>
      </TitleWrapper>
      {data.args?.length > 0 && (
        <ArgsWrapper>
          {data.args.map((arg, index) => (
            <ArgItem key={index}>
              <div>{arg.name}</div>
              <div>
                {["boolean", "number", "string"].includes(typeof arg.value) ||
                React.isValidElement(arg.value)
                  ? arg.value
                  : JSON.stringify(arg.value)}
              </div>
            </ArgItem>
          ))}
        </ArgsWrapper>
      )}
      <Progress total={data.total} ayes={data.ayes} nays={data.nays} />
    </div>
  );
}
