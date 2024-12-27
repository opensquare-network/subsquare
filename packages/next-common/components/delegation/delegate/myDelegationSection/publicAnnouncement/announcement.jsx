import { useState } from "react";
import { MenuAnnouncement } from "@osn/icons/subsquare";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SplitProxyMenuButton from "next-common/components/splitProxyMenuButton";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useAddressDelegation from "./useAddressDelegation";
import { useUser } from "next-common/context/user";

const AnnouncementPublishPopup = dynamicPopup(() =>
  import("../../PublishAnnouncementPopup"),
);

export default function Announcement({ myDelegation }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [proxyAddress, setProxyAddress] = useState();
  const user = useUser();

  const { value: proxyAddressDelegation } = useAddressDelegation(proxyAddress);

  const onClickPublish = (proxyAddress) => {
    setProxyAddress(proxyAddress || user.proxyAddress);
    setIsPopupOpen(true);
  };

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
        <SplitProxyMenuButton
          action={"Publish"}
          onClick={onClickPublish}
          onClickAsProxy={onClickPublish}
        />
      </div>
      {isPopupOpen && (
        <AnnouncementPublishPopup
          onClose={() => setIsPopupOpen(false)}
          myDelegation={proxyAddress ? proxyAddressDelegation : myDelegation}
          proxyAddress={proxyAddress}
        />
      )}
    </SecondaryCard>
  );
}
