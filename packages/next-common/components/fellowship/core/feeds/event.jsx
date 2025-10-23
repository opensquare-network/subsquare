import { cn } from "next-common/utils";
import FellowshipCoreFeedsParamsChangedEvent from "./event/paramsChanged";
import FellowshipCoreFeedsOffboardedEvent from "./event/offboarded";
import FellowshipCoreFeedsProvenEvent from "./event/proven";
import FellowshipCoreFeedsDemotedEvent from "./event/demoted";
import FellowshipCoreFeedsPromotedEvent from "./event/promoted";
import FellowshipCoreFeedsImportedEvent from "./event/imported";
import FellowshipCoreFeedsInductedEvent from "./event/inducted";
import FellowshipCoreFeedsActiveEvent from "./event/active";
import FellowshipCoreFeedsRequestedEvent from "next-common/components/fellowship/core/feeds/event/requested";

export function getFellowshipCoreFeedsEventContent(feed, showUserInfo = true) {
  const event = feed?.event;
  const EVENT_CONTENTS = {
    ActiveChanged: (
      <FellowshipCoreFeedsActiveEvent feed={feed} showUserInfo={showUserInfo} />
    ),
    Demoted: (
      <FellowshipCoreFeedsDemotedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
    Imported: (
      <FellowshipCoreFeedsImportedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
    Inducted: (
      <FellowshipCoreFeedsInductedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
    Offboarded: (
      <FellowshipCoreFeedsOffboardedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
    ParamsChanged: (
      <FellowshipCoreFeedsParamsChangedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
    Promoted: (
      <FellowshipCoreFeedsPromotedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
    Proven: (
      <FellowshipCoreFeedsProvenEvent feed={feed} showUserInfo={showUserInfo} />
    ),
    Requested: (
      <FellowshipCoreFeedsRequestedEvent
        feed={feed}
        showUserInfo={showUserInfo}
      />
    ),
  };

  const content = EVENT_CONTENTS[event];
  return content;
}

export default function FellowshipCoreFeedsListEvent({
  feed = {},
  className = "",
  showUserInfo = true,
}) {
  const content = getFellowshipCoreFeedsEventContent(feed, showUserInfo);

  return (
    <div
      className={cn(
        "flex items-start flex-wrap gap-x-2",
        "text-textTertiary",
        className,
      )}
    >
      {content}
    </div>
  );
}
