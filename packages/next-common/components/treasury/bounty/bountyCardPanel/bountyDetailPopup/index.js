import Popup, { PopupSize } from "next-common/components/popup/wrapper/Popup";
import React from "react";
import BountyDetailPopupSummary from "./bountyDetailPopupSummary";
import BountyDetailPopupTabs from "./tabsContent/index";
function BountyDetailPopup({ onClose, childBounties, bountyIndex, item }) {
  return (
    <Popup
      title="Bounty Detail"
      className="p-6"
      size={PopupSize.MEDIUM}
      onClose={onClose}
    >
      <BountyDetailPopupSummary bountyIndex={bountyIndex} item={item} />
      <BountyDetailPopupTabs
        childBounties={childBounties}
        bountyIndex={bountyIndex}
      />
    </Popup>
  );
}

export default React.memo(BountyDetailPopup);
