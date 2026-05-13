import LoadableContent from "next-common/components/common/loadableContent";
import { InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useCallback, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { TagWrapper } from "next-common/components/comment/voteTag/referendaVoteTag";
import { ThemedTag } from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import { useContextPapi } from "next-common/context/papi";
import { useAsync } from "react-use";
import { decodeCallTree } from "next-common/utils/callDecoder/decoder.mjs";
import PapiCallTreeView from "next-common/components/papiCallTreeView";
import { getCachedMetadata } from "next-common/utils/papi/getCachedMetadata";
import { convertPapiCallTreeToTableView } from "next-common/utils/papi/convertPapiCallTreeToTableView";

const CallDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

export default function CallColumnContent({ call }) {
  if (call?.type === "Inline") {
    return <InlineCallColumnContent callValue={call?.value} />;
  } else if (call?.type === "Lookup") {
    return (
      <PreimageColumnContent hash={call?.value?.hash} len={call?.value?.len} />
    );
  } else {
    return null;
  }
}

function InlineCallColumnContent({ callValue }) {
  const { client } = useContextPapi();

  const { value: callTree, loading } = useAsync(async () => {
    if (!callValue || !client) return null;
    const metadata = await getCachedMetadata(client);
    return decodeCallTree(callValue, metadata);
  }, [callValue, client]);

  return (
    <LoadableContent size={20} isLoading={loading}>
      <CallImpl callTree={callTree} />
    </LoadableContent>
  );
}

async function getPreimageBytes(papi, hash, len) {
  let bytes = null;
  for (const key of [[hash, len], hash]) {
    try {
      bytes = await papi.query.Preimage.PreimageFor.getValue(key);
      if (bytes) {
        break;
      }
    } catch {
      // ignore
    }
  }
  return bytes;
}

function usePreimageCallTree(hash, len) {
  const { api: papi, client } = useContextPapi();
  return useAsync(async () => {
    if (!hash || !papi || !client) {
      return null;
    }

    const bytes = await getPreimageBytes(papi, hash, len);
    if (!bytes) {
      return null;
    }

    const metadata = await getCachedMetadata(client);
    return decodeCallTree(bytes, metadata);
  }, [hash, len, papi, client]);
}

function PreimageColumnContent({ hash, len }) {
  const { value: callTree, loading } = usePreimageCallTree(hash, len);
  return (
    <LoadableContent size={20} isLoading={loading}>
      <CallImpl callTree={callTree} />
    </LoadableContent>
  );
}

function CallImpl({ callTree }) {
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);

  const PapiTree = useCallback(
    () => <PapiCallTreeView proposal={callTree} />,
    [callTree],
  );

  if (!callTree) {
    return null;
  }

  const { section, method } = callTree;

  return (
    <>
      <TagWrapper className="flex items-center gap-x-1 justify-end">
        <span className="inline-flex gap-x-1">
          <ThemedTag>{section}</ThemedTag>
          <ThemedTag>{method}</ThemedTag>
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
          customCallTree={PapiTree}
          tableViewData={convertPapiCallTreeToTableView(callTree)}
          jsonViewData={callTree}
          setShow={setDetailPopupVisible}
        />
      )}
    </>
  );
}
