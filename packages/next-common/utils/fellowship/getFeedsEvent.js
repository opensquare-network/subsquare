import { SECTION_EVENT_CONTENTS } from "../consts/fellowship/feeds";

export const getFeedsEvent = (section, event) => {
  return SECTION_EVENT_CONTENTS?.[section]?.[event] || event;
};

export const getFeedsEventCompatibleValue = (section, event) => {
  if (!event) {
    return null;
  }
  const hasEvent = SECTION_EVENT_CONTENTS?.[section]?.[event];
  if (hasEvent) {
    return event;
  }
  const findEvent = Object.entries(
    SECTION_EVENT_CONTENTS?.[section] || {},
  ).find((item) => item[1] === event);

  return findEvent?.[0] || event;
};
