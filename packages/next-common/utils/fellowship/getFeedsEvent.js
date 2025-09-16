import { SECTION_EVENT_CONTENTS } from "../consts/fellowship/feeds";

export const getFeedsEvent = (section, event) => {
  return SECTION_EVENT_CONTENTS?.[section]?.[event] || event;
};
