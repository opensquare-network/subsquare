import React from "react";
import noop from "lodash.noop";
import { PrimaryButton } from "../../summary/styled";
import AddSvg from "./add.svg";
import styled from "styled-components";
import { OnlyDesktop } from "../../styled/responsive";
import Flex from "../../styled/flex";
import Tooltip from "next-common/components/tooltip";

const Icon = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16px;

  > svg path {
    stroke: var(--textPrimaryContrast);
  }
`;

export default function CreateEventButton({ disabled, onClick = noop }) {
  return (
    <Tooltip content={disabled ? "Only admins can create events" : ""}>
      <div>
        <PrimaryButton disabled={disabled} onClick={onClick}>
          <Icon>
            <AddSvg />
          </Icon>
          <OnlyDesktop>
            <span>Create Event</span>
          </OnlyDesktop>
        </PrimaryButton>
      </div>
    </Tooltip>
  );
}
