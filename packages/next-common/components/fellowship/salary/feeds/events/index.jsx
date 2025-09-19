import FellowshipInductedFeed from "next-common/components/fellowship/feeds/events/inducted";
import { cn } from "next-common/utils";
import FellowshipRegisteredFeed from "next-common/components/fellowship/salary/feeds/events/registered";
import FellowshipCycleStartedFeed from "next-common/components/fellowship/salary/feeds/events/cycleStarted";
import FellowshipCycleEndedFeed from "next-common/components/fellowship/salary/feeds/events/cycleEnded";
import FellowshipSalaryPaidFeed from "next-common/components/fellowship/salary/feeds/events/paid";

export function getFellowshipSalaryFeedsEventContent(
  feed,
  showUserInfo = true,
) {
  const event = feed?.event;
  const EVENT_CONTENTS = {
    Inducted: (
      <FellowshipInductedFeed
        who={feed?.args?.who}
        showUserInfo={showUserInfo}
      />
    ),
    Registered: (
      <FellowshipRegisteredFeed
        who={feed?.args?.who}
        amount={feed?.args?.amount}
        index={feed?.index}
        showUserInfo={showUserInfo}
      />
    ),
    CycleStarted: <FellowshipCycleStartedFeed index={feed?.index} />,
    CycleEnded: <FellowshipCycleEndedFeed index={feed?.index} />,
    Paid: <FellowshipSalaryPaidFeed feed={feed} showUserInfo={showUserInfo} />,
  };
  return EVENT_CONTENTS[event];
}

export default function FellowshipSalaryFeed({ feed = {}, className = "" }) {
  const event = feed?.event;

  const content = getFellowshipSalaryFeedsEventContent(feed);
  if (!content) {
    return event;
  }

  return (
    <div
      className={cn(
        "flex items-center flex-wrap gap-x-2",
        "text-textTertiary",
        className,
      )}
    >
      {content}
    </div>
  );
}
