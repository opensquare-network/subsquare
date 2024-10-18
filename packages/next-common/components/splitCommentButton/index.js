import { SystemComment } from "@osn/icons/subsquare";
import SplitMenuButton from "../splitMenuButton";
import SelectProxyAccountPopup from "../selectProxyAccountPopup";
import { useState } from "react";

export default function SplitCommentButton({
  action,
  onClickComment,
  onClickCommentAsProxy,
  ...props
}) {
  const [isSelectProxyAccountPopupOpen, setIsSelectProxyAccountPopupOpen] =
    useState(false);
  return (
    <>
      <SplitMenuButton
        {...props}
        onClick={onClickComment}
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
          onClose={() => setIsSelectProxyAccountPopupOpen(false)}
          onSelect={onClickCommentAsProxy}
        />
      )}
    </>
  );
}
