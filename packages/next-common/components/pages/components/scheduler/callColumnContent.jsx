import usePreimage from "next-common/hooks/usePreimage";
import LoadableContent from "next-common/components/common/loadableContent";
import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import { InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import { useChain } from "next-common/context/chain";
import RawCallProvider from "next-common/context/call/raw";
import normalizeCall from "next-common/components/democracy/metadata/normalize";
import { TagWrapper } from "next-common/components/comment/voteTag/referendaVoteTag";
import { ThemedTag } from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";

const CallDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

export default function CallColumnContent({ call }) {
  if (call?.type === "Inline") {
    return <InlineCallColumnContent hash={call?.value?.asHex()} />;
  } else if (call?.type === "Lookup") {
    return <PreimageColumnContent hash={call?.value?.hash.asHex()} />;
  } else {
    return null;
  }
}

function InlineCallColumnContent({ hash }) {
  const { call: callDetail, isLoading } = useCallFromHex(hash);

  return (
    <LoadableContent size={20} isLoading={isLoading}>
      <CallImpl call={callDetail} />
    </LoadableContent>
  );
}

function PreimageColumnContent({ hash }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);

  const isLoading = !preimage || !isStatusLoaded || !isBytesLoaded;

  return (
    <LoadableContent size={20} isLoading={isLoading}>
      <CallImpl call={preimage?.proposal} />
    </LoadableContent>
  );
}

function CallImpl({ call }) {
  const chain = useChain();
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);

  const jsonCall = call ? normalizeCall(call) : null;

  const tableViewData = convertProposalForTableView(jsonCall, chain);
  const jsonViewData = convertProposalForJsonView(jsonCall, chain);

  return (
    <RawCallProvider call={call} isLoading={false}>
      <TagWrapper className="flex items-center gap-x-1 justify-end">
        <span className="inline-flex gap-x-1">
          <ThemedTag>{call?.section}</ThemedTag>
          <ThemedTag>{call?.method}</ThemedTag>
        </span>

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
      </TagWrapper>

      {detailPopupVisible && (
        <CallDetailPopup
          jsonViewData={jsonViewData}
          tableViewData={tableViewData}
          hasTreeViewData
          setShow={setDetailPopupVisible}
        />
      )}
    </RawCallProvider>
  );
}
