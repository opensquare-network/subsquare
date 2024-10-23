import { SystemComment } from "@osn/icons/subsquare";
import SplitMenuButton from "../splitMenuButton";
import SelectProxyAccountPopup from "../selectProxyAccountPopup";
import { useState } from "react";
import {
  GeneralProxiesProvider,
  useMyProxied,
} from "next-common/context/proxy";
import PrimaryButton from "next-common/lib/button/primary";

function SplitCommentButtonImpl({
  action,
  onClickComment,
  onClickCommentAsProxy,
  ...props
}) {
  const { proxies } = useMyProxied();

  const [isSelectProxyAccountPopupOpen, setIsSelectProxyAccountPopupOpen] =
    useState(false);

  if (!proxies.length) {
    return (
      <PrimaryButton {...props} onClick={onClickComment}>
        {action}
      </PrimaryButton>
    );
  }

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

export default function SplitCommentButton(props) {
  return (
    <GeneralProxiesProvider>
      <SplitCommentButtonImpl {...props} />
    </GeneralProxiesProvider>
  );
}
