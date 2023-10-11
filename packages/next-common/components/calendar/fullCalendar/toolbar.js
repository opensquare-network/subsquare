import React from "react";
import styled from "styled-components";
import Divider from "../../styled/layout/divider";
import { Button } from "../../summary/styled";
import CaretLeft from "../../icons/caretLeft";
import CaretRight from "../../icons/caretRight";
import Flex from "../../styled/flex";
import CreateEventButton from "./createEventButton";
import noop from "lodash.noop";
import { useIsLogin } from "../../../context/user";
import { OnlyDesktop } from "../../styled/responsive";
import useIsAdmin from "next-common/hooks/useIsAdmin";

const NavigateButton = styled(Button)`
  padding: 4px;
`;

/**
 * @param {import('react-big-calendar').ToolbarProps} props
 */
export default function FullCalendarToolbar({
  onNavigate,
  label,
  localizer: { messages },
  setSelectedDate,
  onCreateEvent = noop,
}) {
  const isAdmin = useIsAdmin();
  const isLogin = useIsLogin();

  function gotoToday() {
    onNavigate("TODAY");
    setSelectedDate(new Date());
  }

  return (
    <div className="flex flex-col gap-y-4 mb-4">
      <div className="flex justify-between">
        <Flex>
          <div className="flex space-x-2">
            <NavigateButton
              onClick={() => onNavigate("PREV")}
              arial-label={messages.previous}
            >
              <CaretLeft />
            </NavigateButton>

            <NavigateButton
              onClick={() => onNavigate("NEXT")}
              arial-label={messages.next}
            >
              <CaretRight />
            </NavigateButton>
          </div>

          <span className="text16Bold ml-4 text-textPrimary">{label}</span>
        </Flex>

        <Flex style={{ gap: "8px" }}>
          <OnlyDesktop>
            <Button onClick={gotoToday}>Today</Button>
          </OnlyDesktop>
          {isLogin && (
            <CreateEventButton onClick={onCreateEvent} disabled={!isAdmin} />
          )}
        </Flex>
      </div>

      <Divider />
    </div>
  );
}
