import { useState } from "react";
import Select from "next-common/components/select";

export default function useEventFilter(events = [], curEvent) {
  const options = (events || []).map((event) => ({
    label: String(event),
    value: event,
  }));

  options.unshift({
    label: "All",
    value: null,
  });

  const [event, setEvent] = useState(curEvent || options[0].value);

  const component = (
    <div className="text12Medium text-textPrimary flex items-center gap-x-2">
      <div>Event</div>
      <Select
        className="w-40"
        small
        value={event}
        options={options}
        onChange={(option) => {
          setEvent(option.value);
        }}
      />
    </div>
  );

  return {
    event,
    component,
  };
}
