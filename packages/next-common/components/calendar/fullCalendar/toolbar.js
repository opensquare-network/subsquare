import Divider from "../../styled/layout/divider";
import SecondaryButton from "next-common/lib/button/secondary";
import CaretLeft from "../../icons/caretLeft";
import CaretRight from "../../icons/caretRight";
import Flex from "../../styled/flex";
import CreateEventButton from "./createEventButton";
import { noop } from "lodash-es";
import { useUser } from "../../../context/user";
import { OnlyDesktop } from "../../styled/responsive";
import useIsAdmin from "next-common/hooks/useIsAdmin";

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
  const user = useUser();

  function gotoToday() {
    onNavigate("TODAY");
    setSelectedDate(new Date());
  }

  return (
    <div className="flex flex-col gap-y-4 mb-4">
      <div className="flex justify-between">
        <Flex>
          <div className="flex space-x-2">
            <SecondaryButton
              size="small"
              className="w-7 p-0"
              onClick={() => onNavigate("PREV")}
              arial-label={messages.previous}
            >
              <CaretLeft />
            </SecondaryButton>

            <SecondaryButton
              size="small"
              className="w-7 p-0"
              onClick={() => onNavigate("NEXT")}
              arial-label={messages.next}
            >
              <CaretRight />
            </SecondaryButton>
          </div>

          <span className="text16Bold ml-4 text-textPrimary">{label}</span>
        </Flex>

        <Flex style={{ gap: "8px" }}>
          <OnlyDesktop>
            <SecondaryButton size="small" onClick={gotoToday}>
              Today
            </SecondaryButton>
          </OnlyDesktop>
          {user && (
            <CreateEventButton onClick={onCreateEvent} disabled={!isAdmin} />
          )}
        </Flex>
      </div>

      <Divider />
    </div>
  );
}
