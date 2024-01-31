import { cn } from "next-common/utils";
import { useState } from "react";
import FellowshipCoreFeedsCompareParamsChangesPopup from "./compareParamsChangesPopup";
import FellowshipCoreFeedsParamsChangedEvent from "./event/paramsChanged";
import FellowshipCoreFeedsOffboardedEvent from "./event/offboarded";
import FellowshipCoreFeedsRetentionEvent from "./event/rentention";
import FellowshipCoreFeedsPromotionEvent from "./event/promotion";
import FellowshipCoreFeedsProvedEvent from "./event/proved";
import FellowshipCoreFeedsDemotedEvent from "./event/demoted";
import FellowshipCoreFeedsPromotedEvent from "./event/promoted";
import FellowshipCoreFeedsImportedEvent from "./event/imported";
import FellowshipCoreFeedsInductedEvent from "./event/inducted";
import FellowshipCoreFeedsActiveEvent from "./event/active";
import FellowshipCoreFeedsInactiveEvent from "./event/inactive";
import FellowshipCoreFeedsRetainedEvent from "./event/retained";

export default function FellowshipCoreFeedsListEvent({
  feed = {},
  className = "",
}) {
  const event = feed?.event;

  const [comparePopupVisible, setComparePopupVisible] = useState(false);

  const EVENT_CONTENTS = {
    Inducted: <FellowshipCoreFeedsInductedEvent feed={feed} />,
    Imported: <FellowshipCoreFeedsImportedEvent feed={feed} />,
    Promoted: <FellowshipCoreFeedsPromotedEvent feed={feed} />,
    Demoted: <FellowshipCoreFeedsDemotedEvent feed={feed} />,
    Proved: <FellowshipCoreFeedsProvedEvent feed={feed} />,
    // TODO: promotion, evidence link
    Promotion: <FellowshipCoreFeedsPromotionEvent feed={feed} />,
    // TODO: rentenion, evidence link
    Rentention: <FellowshipCoreFeedsRetentionEvent feed={feed} />,
    Offboarded: <FellowshipCoreFeedsOffboardedEvent feed={feed} />,
    Active: <FellowshipCoreFeedsActiveEvent feed={feed} />,
    Inactive: <FellowshipCoreFeedsInactiveEvent feed={feed} />,
    Retained: <FellowshipCoreFeedsRetainedEvent feed={feed} />,
    ParamsChanged: (
      <FellowshipCoreFeedsParamsChangedEvent
        setComparePopupVisible={setComparePopupVisible}
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
