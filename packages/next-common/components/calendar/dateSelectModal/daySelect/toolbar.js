import React from "react";
import styled from "styled-components";
import Divider from "../../../styled/layout/divider";
import { Button } from "../../../summary/styled";
import CaretLeft from "../../../icons/caretLeft";
import CaretRight from "../../../icons/caretRight";
import Flex from "../../../styled/flex";
import { p_14_bold } from "../../../../styles/componentCss";
import {
  flex,
  flex_col,
  gap_y,
  justify_between,
  m_b,
  m_l,
  p,
  space_x,
} from "../../../../styles/tailwindcss";

const ToolbarWrapper = styled.div`
  ${flex}
  ${flex_col}
  ${gap_y(16)}
  ${m_b(16)}
`;

const ToolbarGroup = styled.div`
  ${flex}
  ${justify_between}
`;

const ToolbarButtonGroup = styled.div`
  ${flex}
  ${space_x(8)}
  flex-grow: 1;
`;

const ToolbarDateLabel = styled(Flex)`
  ${p_14_bold}
  ${m_l(16)}
  color: var(--textPrimary);
  flex-grow: 1;
  justify-content: center;
`;

const NavigateButton = styled(Button)`
  ${p(8)}
`;

export default function CalendarToolbar({
  onNavigate,
  label,
  localizer: { messages },
}) {
  return (
    <ToolbarWrapper>
      <ToolbarGroup>
        <Flex style={{ flexGrow: 1 }}>
          <ToolbarButtonGroup>
            <NavigateButton
              onClick={() => onNavigate("PREV")}
              arial-label={messages.previous}
            >
              <CaretLeft />
            </NavigateButton>

            <ToolbarDateLabel>{label}</ToolbarDateLabel>

            <NavigateButton
              onClick={() => onNavigate("NEXT")}
              arial-label={messages.next}
            >
              <CaretRight />
            </NavigateButton>
          </ToolbarButtonGroup>
        </Flex>
      </ToolbarGroup>

      <Divider />
    </ToolbarWrapper>
  );
}
