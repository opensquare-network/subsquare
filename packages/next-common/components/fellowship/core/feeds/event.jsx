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
import dynamic from "next/dynamic";

const FellowshipCoreFeedsCompareParamsChangesPopup = dynamic(
  () => import("./compareParamsChangesPopup"),
  {
    ssr: false,
  },
);

export default function FellowshipCoreFeedsListEvent({
  feed = {},
  className = "",
}) {
  const event = feed?.event;

  const [comparePopupVisible, setComparePopupVisible] = useState(false);

  const EVENT_CONTENTS = {
    ActiveChanged: <FellowshipCoreFeedsActiveEvent feed={feed} />,
    Demoted: <FellowshipCoreFeedsDemotedEvent feed={feed} />,
    Imported: <FellowshipCoreFeedsImportedEvent feed={feed} />,
    Inducted: <FellowshipCoreFeedsInductedEvent feed={feed} />,
    Offboarded: <FellowshipCoreFeedsOffboardedEvent feed={feed} />,
    ParamsChanged: (
      <FellowshipCoreFeedsParamsChangedEvent
        setComparePopupVisible={setComparePopupVisible}
      />
    ),
    Promoted: <FellowshipCoreFeedsPromotedEvent feed={feed} />,
    Proven: <FellowshipCoreFeedsProvenEvent feed={feed} />,
    Requested: <FellowshipCoreFeedsRequestedEvent feed={feed} />,
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
