import React from "react";
import styled from "styled-components";
import Divider from "../../../styled/layout/divider";
import { Button } from "../../../summary/styled";
import CaretLeft from "../../../icons/caretLeft";
import CaretRight from "../../../icons/caretRight";
import Flex from "../../../styled/flex";

const NavigateButton = styled(Button)`
  padding: 8px;
`;

export default function CalendarToolbar({
  onNavigate,
  label,
  localizer: { messages },
}) {
  return (
    <div className="flex flex-col gap-y-4 mb-4">
      <div className="flex justify-between">
        <Flex style={{ flexGrow: 1 }}>
          <div className="flex space-x-2 grow">
            <NavigateButton
              onClick={() => onNavigate("PREV")}
              arial-label={messages.previous}
            >
              <CaretLeft />
            </NavigateButton>

            <Flex className="text14Bold ml-4 text-textPrimary grow justify-center">
              {label}
            </Flex>

            <NavigateButton
              onClick={() => onNavigate("NEXT")}
              arial-label={messages.next}
            >
              <CaretRight />
            </NavigateButton>
          </div>
        </Flex>
      </div>

      <Divider />
    </div>
  );
}
