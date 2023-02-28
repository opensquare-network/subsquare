import React from "react";
import styled from "styled-components";
import Divider from "../../styled/layout/divider";
import { Button } from "../../summary/styled";
import CaretLeft from "../../icons/caretLeft";
import CaretRight from "../../icons/caretRight";
import Flex from "../../styled/flex";
import { Navigate } from "react-big-calendar";
import { p_16_bold } from "../../../styles/componentCss";
import {
  flex,
  flex_col,
  gap_y,
  justify_between,
  m_b,
  m_l,
  p,
  space_x,
  text_primary,
} from "../../../styles/tailwindcss";

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
`;

const ToolbarDateLabel = styled.span`
  ${p_16_bold}
  ${m_l(16)}
  ${text_primary}
`;

const NavigateButton = styled(Button)`
  ${p(4)}
`;

export default function FullCalendarToolbar({
  onNavigate,
  label,
  localizer: { messages },
}) {
  return (
    <ToolbarWrapper>
      <ToolbarGroup>
        <Flex>
          <ToolbarButtonGroup>
            <NavigateButton
              onClick={() => onNavigate(Navigate.PREVIOUS)}
              arial-label={messages.previous}
            >
              <CaretLeft />
            </NavigateButton>

            <NavigateButton
              onClick={() => onNavigate(Navigate.NEXT)}
              arial-label={messages.next}
            >
              <CaretRight />
            </NavigateButton>
          </ToolbarButtonGroup>

          <ToolbarDateLabel>{label}</ToolbarDateLabel>
        </Flex>

        <Flex>
          <Button onClick={() => onNavigate(Navigate.TODAY)}>Today</Button>
        </Flex>
      </ToolbarGroup>

      <Divider />
    </ToolbarWrapper>
  );
}
