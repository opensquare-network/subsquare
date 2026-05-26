import CollapsePanel from "../collapsePanel";
import { useUpcomingEventsContext } from "./context";
import UpcomingEventItem from "./item";

function Title() {
  return (
    <div className="flex items-center gap-1 text14Medium text-textTertiary">
      <span>Upcoming events</span>
    </div>
  );
}

export default function UpcomingEventsPanel() {
  const { events } = useUpcomingEventsContext();

  if (!events.length) {
    return null;
  }

  return (
    <CollapsePanel labelItem={<Title />} defaultCollapsed={false}>
      <div className="flex flex-col gap-1 max-sm:gap-2">
        {events.map((event) => (
          <UpcomingEventItem key={event.id} event={event} />
        ))}
      </div>
    </CollapsePanel>
  );
}
