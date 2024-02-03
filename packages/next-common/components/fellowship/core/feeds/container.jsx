import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipCoreFeedsList from "./list";
import Select from "next-common/components/select";
import { useState } from "react";

export default function FellowshipCoreFeedsContainer({ feeds = {} }) {
  const [event, setEvent] = useState("");

  // TODO: core feeds, event filter options
  const options = [
    {
      label: "All",
      value: "",
    },
  ];

  return (
    <>
      <TitleContainer>
        <span>
          Feeds
          {!!feeds.total && (
            <span className="text-textTertiary text14Medium ml-1">
              {feeds.total}
            </span>
          )}
        </span>

        {/* TODO: event filter */}
        {false && (
          <div className="text12Medium text-textPrimary flex items-center gap-x-2">
            <div>Event</div>
            <Select
              className="w-20"
              small
              value={event}
              options={options}
              onChange={(option) => {
                setEvent(option.value);
              }}
            />
          </div>
        )}
      </TitleContainer>
      <div className="space-y-4 mt-4">
        <FellowshipCoreFeedsList feeds={feeds} />
      </div>
    </>
  );
}
