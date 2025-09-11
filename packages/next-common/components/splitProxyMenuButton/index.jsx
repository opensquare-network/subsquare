import { SystemComment } from "@osn/icons/subsquare";
import SplitMenuButton from "next-common/lib/button/splitMenuButton";
import SelectProxyAccountPopup from "../selectProxyAccountPopup";
import { useState } from "react";
import { useUser } from "next-common/context/user";

export default function SplitProxyMenuButton({
  action,
  onClick,
  onClickAsProxy,
  ...props
}) {
  const user = useUser();
  const [isSelectProxyAccountPopupOpen, setIsSelectProxyAccountPopupOpen] =
    useState(false);

  return (
    <>
      <SplitMenuButton
        {...props}
        onClick={() => onClick()}
        dropdownMenuItems={[
          {
            icon: (
              <SystemComment
                className="[&_path]:stroke-textSecondary"
                width={24}
                height={24}
              />
            ),
            label: `${action} as a proxy`,
            onClick: () => setIsSelectProxyAccountPopupOpen(true),
          },
        ]}
      >
        {action}
      </SplitMenuButton>
      {isSelectProxyAccountPopupOpen && (
        <SelectProxyAccountPopup
          userAddress={user?.address}
          onClose={() => setIsSelectProxyAccountPopupOpen(false)}
          onSelect={onClickAsProxy}
        />
      )}
    </>
  );
}
