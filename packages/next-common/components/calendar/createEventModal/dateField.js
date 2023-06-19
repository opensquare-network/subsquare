import dayjs from "dayjs";
import noop from "lodash.noop";
import React from "react";
import styled from "styled-components";
import Labeled from "../../../components/Labeled";
import { p_14_normal } from "../../../styles/componentCss";
import Flex from "../../styled/flex";
import RightSVG from "./right.svg";

const DateWrapper = styled.div`
  display: flex;
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  overflow: hidden;

  ${p_14_normal}
  line-height: 100%;
`;

const DateLabel = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--neutral200);

  ${p_14_normal}

  color: var(--textPrimary);
  white-space: nowrap;
`;

const Time = styled.div`
  ${p_14_normal}
  line-height: 100%;
  padding: 12px 16px;
  flex-grow: 1;
  background: var(--neutral100);
  color: var(--textTertiary);
`;

const Icon = styled(Flex)`
  margin: 0 16px 0 8px;
  > svg path {
    stroke: var(--textPrimary);
  }
`;

export default function DateField({
  title = "Date",
  optional,
  value,
  onClick = noop,
}) {
  return (
    <Labeled text={title} status={optional && "Optional"}>
      <DateWrapper>
        <DateLabel>{title}</DateLabel>
        <Flex style={{ flex: 1, cursor: "pointer" }} onClick={onClick}>
          <Time>
            {value
              ? dayjs(value).format("YYYY-MM-DD HH:mm")
              : "Please select the time..."}
          </Time>
          <Icon>
            <RightSVG />
          </Icon>
        </Flex>
      </DateWrapper>
    </Labeled>
  );
}
