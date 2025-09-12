import FeedsVotedEvent from "next-common/components/feeds/referendaEvents/voted";

const EVENT_COMPONENTS = {
  Voted: FeedsVotedEvent,
};

export default function FellowshipCommonEventList({ event }) {
  const Component = EVENT_COMPONENTS[event.event];

  if (!Component) {
    return null;
  }

  return (
    <>
      <Component key={event.event} event={event} />
    </>
  );
}
