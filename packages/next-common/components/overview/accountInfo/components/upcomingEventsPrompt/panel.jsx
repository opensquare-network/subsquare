import CollapsePanel from "../collapsePanel";
import UpcomingEventItem from "./item";

function Title() {
  return (
    <div className="flex items-center gap-1 text14Medium text-textTertiary">
      <span>Upcoming events</span>
    </div>
  );
}

export default function UpcomingEventsPanel({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <CollapsePanel labelItem={<Title />} defaultCollapsed={false}>
      <div className="flex flex-col gap-1 max-sm:gap-2">
        {items.map((item) => (
          <UpcomingEventItem key={item.id} event={item} />
        ))}
      </div>
    </CollapsePanel>
  );
}
