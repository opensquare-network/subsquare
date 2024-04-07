import { useState } from "react";
import { MenuAnnouncement } from "@osn/icons/subsquare";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import PrimaryButton from "next-common/lib/button/primary";
import AnnouncementPublishPopup from "../../PublishAnnouncementPopup";

export default function Announcement() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <SecondaryCard className="flex flex-row gap-[16px] max-sm:flex-col">
      <div className="flex grow gap-[16px] sm:items-center max-sm:gap-[12px] max-sm:flex-col">
        <div className="w-[40px] h-[40px] p-[8px] rounded-[8px] bg-theme100">
          <MenuAnnouncement className="w-[24px] h-[24px] [&_path]:fill-theme500" />
        </div>
        <div className="flex flex-col grow">
          <span className="text16Bold text-textPrimary">
            Publish delegation announcement
          </span>
          <span className="text14Medium text-textTertiary">
            Make a statement to get more delegators.
          </span>
        </div>
      </div>
      <div className="flex items-center max-sm:justify-end">
        <PrimaryButton onClick={() => setIsPopupOpen(true)}>
          Publish
        </PrimaryButton>
      </div>
      {isPopupOpen && (
        <AnnouncementPublishPopup onClose={() => setIsPopupOpen(false)} />
      )}
    </SecondaryCard>
  );
}
