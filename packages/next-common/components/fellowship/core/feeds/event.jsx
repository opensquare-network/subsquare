import { cn } from "next-common/utils";
import { useState } from "react";
import FellowshipCoreFeedsParamsChangedEvent from "./event/paramsChanged";
import FellowshipCoreFeedsOffboardedEvent from "./event/offboarded";
import FellowshipCoreFeedsProvenEvent from "./event/proven";
import FellowshipCoreFeedsDemotedEvent from "./event/demoted";
import FellowshipCoreFeedsPromotedEvent from "./event/promoted";
import FellowshipCoreFeedsImportedEvent from "./event/imported";
import FellowshipCoreFeedsInductedEvent from "./event/inducted";
import FellowshipCoreFeedsActiveEvent from "./event/active";
import FellowshipCoreFeedsRequestedEvent from "next-common/components/fellowship/core/feeds/event/requested";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipCoreFeedsCompareParamsChangesPopup = dynamicPopup(() =>
  import("./compareParamsChangesPopup"),
);

export default function FellowshipCoreFeedsListEvent({
  feed = {},
  className = "",
  showUserInfo = true,
}) {
  const event = feed?.event;

  const [comparePopupVisible, setComparePopupVisible] = useState(false);

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
        setComparePopupVisible={setComparePopupVisible}
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

  return (
    <div
      className={cn(
        "flex items-center flex-wrap gap-x-2",
        "text-textTertiary",
        className,
      )}
    >
      {content}

      {comparePopupVisible && (
        <FellowshipCoreFeedsCompareParamsChangesPopup
          feed={feed}
          onClose={() => {
            setComparePopupVisible(false);
          }}
        />
      )}
    </div>
  );
}
