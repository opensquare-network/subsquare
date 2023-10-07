import React from "react";
import styled from "styled-components";
import Progress from "./progress";
import Flex from "../styled/flex";
import { Approve } from "../icons";
import { GreyPanel } from "../styled/containers/greyPanel";
import AddressUser from "../user/addressUser";

const TitleWrapper = styled(Flex)`
  justify-content: space-between;
  min-height: 28px;
  font-size: 14px;
  > :last-child {
    display: flex;
    align-items: center;
    color: var(--textSecondary);
    > span {
      margin-left: 4px;
    }
  }
`;

const ArgsWrapper = styled(GreyPanel)`
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 28px;
`;

const ArgItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 7px 0;
  > :first-child {
    text-transform: capitalize;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 100%;
    color: var(--textSecondary);
  }
  > :last-child {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 100%;
    color: var(--textPrimary);
  }
`;

export default function Voting({ data }) {
  return (
    <div>
      <TitleWrapper>
        <AddressUser add={data.proposer} />
        <div>
          <div>{data.method}</div>
          <Approve />
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
      {data.total !== undefined &&
        data.ayes !== undefined &&
        data.nays !== undefined && (
          <Progress total={data.total} ayes={data.ayes} nays={data.nays} />
        )}
    </div>
  );
}
