import { InfoDocs } from "@osn/icons/subsquare";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import CallTree from "next-common/components/proposal/callTree";
import { CommonTag } from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";
import { useState } from "react";
import styled from "styled-components";

const CallDetailPopup = dynamicPopup(() => import("../../../callDetailPopup"));

const NameTag = styled(CommonTag)`
  background-color: var(--neutral200);
  color: var(--textPrimary);
  white-space: nowrap;
`;

export function DecodeCallItem({ section, method, decode, rawCall = null }) {
  const isMobile = useIsMobile();
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);

  if (!decode) {
    return null;
  }

  return (
    <div
      className={cn("flex gap-2", {
        "flex-wrap": isMobile,
      })}
    >
      <NameTag>{section}</NameTag>
      <span className="text-textTertiary text14Medium">·</span>
      <div className="flex gap-2">
        <NameTag>{method}</NameTag>
        <Tooltip content="Call Detail">
          <InfoDocs
            role="button"
            className={cn(
              "w-4 h-4 relative top-[0.5px]",
              "[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary",
              "[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary",
            )}
            onClick={() => setDetailPopupVisible(true)}
          />
        </Tooltip>
      </div>
      {detailPopupVisible && (
        <CallDetailPopup
          tableViewData={decode}
          jsonViewData={decode}
          hasTreeViewData={!!rawCall}
          setShow={setDetailPopupVisible}
          customCallTree={
            rawCall ? () => <CallTree call={rawCall} isLoading={false} /> : null
          }
        />
      )}
    </div>
  );
}
