import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { useNavLogoEventBackgroundSrc } from "next-common/hooks/nav/useNavLogoEventBackgroundSrc";

export default function ChainLogoEventBackground() {
  const [navCollapsed] = useNavCollapsed();
  const eventBackgroundSrc = useNavLogoEventBackgroundSrc();

  if (!eventBackgroundSrc) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0",
        navCollapsed && "hidden",
        "bg-no-repeat bg-cover",
        "[background-image:var(--event-light-background)]",
        "dark:[background-image:var(--event-dark-background)]",
      )}
      style={{
        "--event-light-background": `url('${eventBackgroundSrc.light}')`,
        "--event-dark-background": `url('${eventBackgroundSrc.dark}')`,
      }}
    />
  );
}
