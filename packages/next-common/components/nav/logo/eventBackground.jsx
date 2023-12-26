import { useChainSettings } from "next-common/context/chain";
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
    background: "christmas",
  },
];

const event = find(events, (event) => {
  return (
    now.month() + 1 === event.month &&
    now.date() >= event.startDate &&
    now.date() <= event.endDate
  );
});

export default function ChainLogoEventBackground() {
  const chainSettings = useChainSettings();
  const [navCollapsed] = useNavCollapsed();

  chainSettings;

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
          "--event-light-background": `url('/project-menu-bg-${event.background}-light-light.png')`,
          "--event-dark-background": `url('/project-menu-bg-${event.background}-dark.png')`,
          // backgroundImage: "var(--event-light-background)",
        }}
      />
    )
  );
}
