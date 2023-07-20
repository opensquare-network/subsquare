import { useState } from "react";
import KvList from "../listInfo/kvList";
import DetailCallPopup from "../popup/detailCallPopup";
import { InfoDocs } from "@osn/icons/subsquare";
import { ThemedTag } from "../tags/state/styled";
import { useOnchainData } from "next-common/context/post";
import clsx from "clsx";

export default function DetailMultiTabCall({
  call = {},
  shorten,
  proposalIndex,
  motionIndex,
  referendumIndex,
}) {
  const onchainData = useOnchainData();
  const proposalHash = onchainData?.proposalHash;

  const [detailCallVisible, setDetailCallVisible] = useState(false);

  const data = [
    ["Proposal Hash", proposalHash],
    [
      "Call",
      <div key={"call"} className="flex items-center gap-x-2 leading-[140%]">
        <span className="space-x-1">
          <ThemedTag>{call.section}</ThemedTag>
          <ThemedTag>{call.method}</ThemedTag>
        </span>
        <InfoDocs
          role="button"
          className={clsx(
            "w-4 h-4 relative top-[0.5px]",
            "[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary",
            "[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary",
          )}
          onClick={() => setDetailCallVisible(true)}
        />
      </div>,
    ],
  ];

  return (
    <div>
      <KvList data={data} />

      {detailCallVisible && (
        <DetailCallPopup
          onClose={() => setDetailCallVisible(false)}
          shorten={shorten}
          call={call}
          referendumIndex={referendumIndex}
          motionIndex={motionIndex}
          proposalIndex={proposalIndex}
        />
      )}
    </div>
  );
}
