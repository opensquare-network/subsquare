// file format:
// - light: project-menu-bg-{event.name}-{light|dark}-dark.png
// - dark:  project-menu-bg-{event.name}-dark.png

import dayjs from "dayjs";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import find from "lodash.find";

const now = dayjs();

const events = [
  {
    name: "christmas",
    month: 12,
    startDate: 23,
    endDate: 31,
  },
];

const event = find(events, (event) => {
  return (
    now.month() + 1 === event.month &&
    now.date() >= event.startDate &&
    now.date() <= event.endDate
  );
});

export default function ChainLogoEventBackground({ preferDark }) {
  const [navCollapsed] = useNavCollapsed();

  const lightBackground = `url('/project-menu-bg-${event.name}-${
    preferDark ? "dark" : "light"
  }-light.png')`;
  const darkBackground = `url('/project-menu-bg-${event.name}-dark.png')`;

  return (
    event && (
      <div
        className={cn(
          "absolute inset-0",
          navCollapsed && "hidden",
          "bg-no-repeat bg-cover",
          "[background-image:var(--event-light-background)]",
          "dark:[background-image:var(--event-dark-background)]",
        )}
        style={{
          "--event-light-background": lightBackground,
          "--event-dark-background": darkBackground,
        }}
      />
    )
  );
}
